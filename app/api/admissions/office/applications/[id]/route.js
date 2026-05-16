import { NextResponse } from 'next/server'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { serializeApplication } from '@/lib/admissions/application-serialize'
import { forbidUnlessAny, getAdmissionOfficeCtx } from '@/lib/admissions/office-guard'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { notifyApplicantAdmittedOutbound } from '@/lib/admissions/email-notify'
import { appendTimeline, notifyApplicant } from '@/lib/admissions/lifecycle'
import { P } from '@/lib/rbac/constants'

const VIEW_PERMS = [
  P.ADMISSIONS_PIPELINE_VIEW,
  P.ADMISSIONS_VIEW,
  P.ADMISSIONS_MANAGE,
  P.ADMISSIONS_APPLICATION_REVIEW,
  P.ADMISSIONS_DOCUMENTS_VERIFY,
]

const PATCH_PERMS = [P.ADMISSIONS_APPLICATION_REVIEW, P.ADMISSIONS_MANAGE]

const DOC_VERIFY_PERMS = [P.ADMISSIONS_DOCUMENTS_VERIFY, P.ADMISSIONS_MANAGE]

const staffInclude = {
  applicant: { select: { id: true, email: true, name: true, role: true } },
  admissionFaculty: true,
  admissionProgram: true,
  admissionIntake: true,
  documents: true,
  timeline: { orderBy: { createdAt: 'asc' }, take: 140 },
  comments: { orderBy: { createdAt: 'desc' }, take: 80 },
  payments: true,
}

export async function GET(_request, { params }) {
  const id = String((await params).id ?? '').trim()

  const { response, permissionKeys } = await getAdmissionOfficeCtx()
  if (response) return response
  const gate = forbidUnlessAny(permissionKeys, VIEW_PERMS)
  if (gate) return gate

  const row = await prisma.admissionApplication.findUnique({
    where: { id },
    include: staffInclude,
  })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ application: serializeApplication(row), applicantEmail: row.applicant.email })
}

const PatchBody = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('setStatus'),
    status: z.enum(['UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'REJECTED', 'PROVISIONAL_ACCEPT']),
    note: z.string().trim().max(2000).optional(),
  }),
  z.object({
    action: z.literal('comment'),
    body: z.string().trim().min(1).max(4000),
    visibility: z.enum(['APPLICANT', 'INTERNAL']),
  }),
  z.object({
    action: z.literal('verifyDocument'),
    documentId: z.string(),
    verified: z.boolean(),
    rejectReason: z.string().trim().max(500).optional(),
  }),
])

function canTransition(curr, incoming) {
  if (incoming === 'PROVISIONAL_ACCEPT') {
    return curr === ADMISSION_STATUS.UNDER_REVIEW || curr === ADMISSION_STATUS.SUBMITTED
  }

  if (curr === ADMISSION_STATUS.DRAFT) return false
  if (
    curr === ADMISSION_STATUS.ENROLLED ||
    curr === ADMISSION_STATUS.REJECTED ||
    curr === ADMISSION_STATUS.AWAITING_PAYMENT
  ) {
    return false
  }

  if (incoming === ADMISSION_STATUS.UNDER_REVIEW) {
    return curr === ADMISSION_STATUS.SUBMITTED || curr === ADMISSION_STATUS.AWAITING_DOCUMENTS
  }
  if (incoming === ADMISSION_STATUS.AWAITING_DOCUMENTS) {
    return curr === ADMISSION_STATUS.SUBMITTED || curr === ADMISSION_STATUS.UNDER_REVIEW
  }
  if (incoming === ADMISSION_STATUS.REJECTED) {
    return curr === ADMISSION_STATUS.SUBMITTED || curr === ADMISSION_STATUS.UNDER_REVIEW
  }
  return false
}

export async function PATCH(request, { params }) {
  const id = String((await params).id ?? '').trim()
  const { response, permissionKeys, admin } = await getAdmissionOfficeCtx()
  if (response) return response
  const parsedBody = PatchBody.safeParse(await request.json())
  if (!parsedBody.success) {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }
  const body = parsedBody.data

  const app = await prisma.admissionApplication.findUnique({
    where: { id },
    include: staffInclude,
  })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (body.action === 'setStatus') {
    const gate = forbidUnlessAny(permissionKeys, PATCH_PERMS)
    if (gate) return gate

    if (body.status === 'PROVISIONAL_ACCEPT') {
      const ok = canTransition(app.status, 'PROVISIONAL_ACCEPT')
      if (!ok || app.status === ADMISSION_STATUS.ENROLLED) {
        return NextResponse.json({ error: 'Illegal transition.' }, { status: 400 })
      }
      await prisma.$transaction(async (tx) => {
        await tx.admissionApplication.update({
          where: { id },
          data: {
            status: ADMISSION_STATUS.AWAITING_PAYMENT,
            decisionAt: new Date(),
          },
        })
        const existing = await tx.admissionFeePayment.findFirst({
          where: { applicationId: id, status: { in: ['PENDING', 'VERIFIED'] } },
        })
        if (!existing) {
          await tx.admissionFeePayment.create({
            data: {
              applicationId: id,
              label: 'Provisional admission · registration levy',
              amountMinor: 150_000,
              currency: 'SSP',
              gateway: 'AWAIT_INSTRUCTIONS',
              status: 'PENDING',
              meta: JSON.stringify({ seededByDesk: admin?.id }),
            },
          })
        }
        await tx.admissionTimelineEvent.create({
          data: {
            applicationId: id,
            actorUserId: admin?.id,
            eventType: 'PROVISIONAL_ADMISSION_ISSUED',
            payload: JSON.stringify({ note: body.note ?? '' }),
          },
        })
      })
      await notifyApplicant(
        app.applicantUserId,
        'Provisional admission — action required',
        'Congratulations! Admissions has cleared you for provisional placement. Submit your acceptance fee inside the Applicant Payments tab.',
        { applicationId: id },
      )
      void notifyApplicantAdmittedOutbound({
        email: app.applicant.email,
        fullName: app.fullName ?? app.applicant.name,
        programName: app.admissionProgram?.name ?? null,
      })
    } else {
      /** @type {string} */
      const target = body.status
      const ok = canTransition(app.status, target)
      if (!ok) return NextResponse.json({ error: 'Illegal transition.' }, { status: 400 })
      const patch = { status: target }
      if (target === ADMISSION_STATUS.REJECTED) patch.decisionAt = new Date()
      await prisma.admissionApplication.update({
        where: { id },
        data: patch,
      })
      await appendTimeline(id, 'STATUS_CHANGED_FROM_DESK', { to: target, note: body.note }, admin?.id ?? null)

      const title =
        target === ADMISSION_STATUS.REJECTED ? 'Admission update' : 'Application status refreshed'
      const msg =
        target === ADMISSION_STATUS.REJECTED
          ? `Your application was unsuccessful this cycle. (${body.note ?? 'See Admissions comments.'})`
          : 'Admissions refreshed your dossier stage — sign in for next steps.'
      await notifyApplicant(app.applicantUserId, title, msg, { applicationId: id, stage: target })
    }
  }

  if (body.action === 'comment') {
    const gate = forbidUnlessAny(permissionKeys, PATCH_PERMS)
    if (gate) return gate
    await prisma.admissionComment.create({
      data: {
        applicationId: id,
        authorId: admin?.id,
        visibility: body.visibility,
        body: body.body,
      },
    })
    if (body.visibility === 'APPLICANT') {
      await notifyApplicant(app.applicantUserId, 'Message from Admissions', body.body.slice(0, 240), {
        applicationId: id,
      })
    }
  }

  if (body.action === 'verifyDocument') {
    const gate = forbidUnlessAny(permissionKeys, DOC_VERIFY_PERMS)
    if (gate) return gate
    const doc = await prisma.admissionDocument.findFirst({ where: { id: body.documentId, applicationId: id } })
    if (!doc) return NextResponse.json({ error: 'Document not found.' }, { status: 404 })

    await prisma.admissionDocument.update({
      where: { id: doc.id },
      data: {
        verifiedAt: body.verified ? new Date() : null,
        verifiedById: body.verified ? admin?.id : null,
        rejectReason: body.verified ? null : body.rejectReason ?? 'Needs attention',
      },
    })
    await appendTimeline(id, 'DOCUMENT_VERIFICATION', {
      documentId: doc.id,
      verified: body.verified,
      reason: body.rejectReason,
    })
  }

  const fresh = await prisma.admissionApplication.findUnique({
    where: { id },
    include: staffInclude,
  })
  return NextResponse.json({ application: serializeApplication(fresh) })
}
