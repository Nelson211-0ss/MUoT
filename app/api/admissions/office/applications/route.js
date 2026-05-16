import { NextResponse } from 'next/server'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { forbidUnlessAny, getAdmissionOfficeCtx } from '@/lib/admissions/office-guard'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { normalizeRoleSlug, P } from '@/lib/rbac/constants'
import { hashPassword } from '@/lib/auth'

const LIST_PERM = [
  P.ADMISSIONS_PIPELINE_VIEW,
  P.ADMISSIONS_VIEW,
  P.ADMISSIONS_MANAGE,
  P.ADMISSIONS_APPLICATION_REVIEW,
  P.ADMISSIONS_ANALYTICS_VIEW,
]

const MANUAL_PERMS = [P.ADMISSIONS_MANUAL_APPLICATION, P.ADMISSIONS_MANAGE]

const ManualSchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(2).max(160),
  password: z.string().min(8).max(128),
  phone: z.string().trim().max(40).optional().default(''),
  programId: z.string().trim().min(1),
  intakeId: z.string().trim().min(1),
})

export async function GET(request) {
  const { response, admin, permissionKeys } = await getAdmissionOfficeCtx()
  if (response) return response

  const gate = forbidUnlessAny(permissionKeys, LIST_PERM)
  if (gate) return gate

  const { searchParams } = request.nextUrl
  const status = searchParams.get('status') ?? ''
  const q = searchParams.get('q')?.trim()?.toLowerCase() ?? ''

  const validStatuses = Object.values(ADMISSION_STATUS)
  const normalizedStatus =
    typeof status === 'string' && status && validStatuses.includes(status) ? status : null

  const whereClause = normalizedStatus ? { status: normalizedStatus } : {}

  const rows = await prisma.admissionApplication.findMany({
    where: whereClause,
    include: {
      applicant: { select: { email: true, name: true, id: true } },
      admissionProgram: true,
      admissionIntake: true,
    },
    orderBy: [{ updatedAt: 'desc' }],
    take: 500,
  })

  /** @sqlite */
  const filtered = q.length
    ? rows.filter((r) => `${r.fullName ?? ''} ${r.applicant?.email ?? ''}`.toLowerCase().includes(q))
    : rows

  /** @type {Record<string, number>} */
  const SORT = {
    SUBMITTED: 0,
    UNDER_REVIEW: 1,
    AWAITING_DOCUMENTS: 2,
    AWAITING_PAYMENT: 3,
    APPROVED: 4,
    DRAFT: 5,
    REJECTED: 6,
    ENROLLED: 7,
  }
  filtered.sort((a, b) => {
    const da = SORT[a.status] ?? 99
    const db = SORT[b.status] ?? 99
    if (da !== db) return da - db
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return NextResponse.json({
    viewer: admin,
    applications: filtered.map((a) => ({
      id: a.id,
      status: a.status,
      applicant: a.applicant,
      program: a.admissionProgram,
      intake: a.admissionIntake,
      studentNumber: a.studentNumber,
      updatedAt: a.updatedAt.toISOString(),
      submittedAt: a.submittedAt?.toISOString() ?? null,
      fullName: a.fullName,
    })),
  })
}

export async function POST(request) {
  const { response, admin, permissionKeys } = await getAdmissionOfficeCtx()
  if (response) return response

  const gate = forbidUnlessAny(permissionKeys, MANUAL_PERMS)
  if (gate) return gate

  const raw = await request.json()
  const parsed = ManualSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }
  const { email: rawEmail, fullName, password, phone, programId, intakeId } = parsed.data
  const email = rawEmail.toLowerCase()

  const program = await prisma.admissionProgram.findUnique({
    where: { id: programId },
    select: { id: true, facultyId: true, code: true, name: true },
  })
  if (!program?.facultyId) {
    return NextResponse.json({ error: 'Program not found.', }, { status: 400 })
  }

  const intake = await prisma.admissionIntake.findUnique({
    where: { id: intakeId },
    select: { id: true, isOpen: true },
  })
  if (!intake) {
    return NextResponse.json({ error: 'Intake not found.' }, { status: 400 })
  }
  if (!intake.isOpen) {
    return NextResponse.json({ error: 'This intake is closed for new applications.' }, { status: 400 })
  }

  const applicantRole = await prisma.role.findUnique({ where: { slug: 'APPLICANT' } })
  if (!applicantRole) {
    return NextResponse.json({ error: 'RBAC not initialized — run database seed.', }, { status: 503 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    const slug = normalizeRoleSlug(existing.role)

    if (slug === 'STUDENT') {
      return NextResponse.json(
        { error: 'This email already belongs to an enrolled learner. Use the Student roster tab instead.' },
        { status: 409 },
      )
    }

    if (slug !== 'APPLICANT') {
      return NextResponse.json({ error: 'That email belongs to campus staff — use a personal applicant email.' }, { status: 409 })
    }

    const openPipeline = await prisma.admissionApplication.findFirst({
      where: {
        applicantUserId: existing.id,
        status: {
          notIn: [ADMISSION_STATUS.REJECTED, ADMISSION_STATUS.ENROLLED],
        },
      },
    })

    /** Only closed dossiers (e.g. rejected) remain — registrar starts a fresh application for the same person. */
    if (!openPipeline) {
      const passwordHashFresh = await hashPassword(password)
      const freshId = await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: existing.id },
          data: {
            name: fullName,
            passwordHash: passwordHashFresh,
            emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
          },
        })
        const appRow = await tx.admissionApplication.create({
          data: {
            applicantUserId: existing.id,
            status: ADMISSION_STATUS.SUBMITTED,
            submittedAt: new Date(),
            fullName,
            phone: phone || null,
            programId,
            intakeId,
            admissionFacultyId: program.facultyId,
          },
          select: { id: true },
        })
        await tx.admissionTimelineEvent.create({
          data: {
            applicationId: appRow.id,
            actorUserId: admin?.id,
            eventType: 'APPLICATION_CREATED_MANUAL_REGISTRAR',
            payload: JSON.stringify({
              source: 'registrar_manual',
              reapplied: true,
              programCode: program.code,
              intakeId,
            }),
          },
        })
        return appRow.id
      })
      return NextResponse.json({ ok: true, applicationId: freshId, reusedApplicantUserId: existing.id })
    }

    if (openPipeline.status === ADMISSION_STATUS.DRAFT) {
      const passwordHash = await hashPassword(password)
      const upgraded = await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: existing.id },
          data: {
            name: fullName,
            passwordHash,
            emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
          },
        })
        await tx.admissionApplication.update({
          where: { id: openPipeline.id },
          data: {
            status: ADMISSION_STATUS.SUBMITTED,
            submittedAt: new Date(),
            fullName,
            phone: phone || null,
            programId,
            intakeId,
            admissionFacultyId: program.facultyId,
          },
        })
        await tx.admissionTimelineEvent.create({
          data: {
            applicationId: openPipeline.id,
            actorUserId: admin?.id,
            eventType: 'APPLICATION_SUBMITTED_MANUAL_REGISTRAR',
            payload: JSON.stringify({ source: 'registrar_manual', upgradedFromDraft: true }),
          },
        })
        return openPipeline.id
      })

      return NextResponse.json({ ok: true, applicationId: upgraded, reusedApplicantUserId: existing.id })
    }

    return NextResponse.json(
      { error: 'This applicant already has an active application in the pipeline. Open it instead of recording again.' },
      { status: 409 },
    )
  }

  const passwordHash = await hashPassword(password)

  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name: fullName,
        passwordHash,
        role: 'APPLICANT',
        emailVerifiedAt: new Date(),
      },
      select: { id: true },
    })
    await tx.userRole.create({ data: { userId: user.id, roleId: applicantRole.id } })
    const appRow = await tx.admissionApplication.create({
      data: {
        applicantUserId: user.id,
        status: ADMISSION_STATUS.SUBMITTED,
        submittedAt: new Date(),
        fullName,
        phone: phone || null,
        programId,
        intakeId,
        admissionFacultyId: program.facultyId,
      },
      select: { id: true },
    })
    await tx.admissionTimelineEvent.create({
      data: {
        applicationId: appRow.id,
        actorUserId: admin?.id,
        eventType: 'APPLICATION_CREATED_MANUAL_REGISTRAR',
        payload: JSON.stringify({
          source: 'registrar_manual',
          programCode: program.code,
          intakeId,
        }),
      },
    })
    return appRow.id
  })

  return NextResponse.json({ ok: true, applicationId: created })
}
