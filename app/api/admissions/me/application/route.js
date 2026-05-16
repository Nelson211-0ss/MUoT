import { NextResponse } from 'next/server'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'
import { resolveApplicantWorkbench } from '@/lib/admissions/active-application'
import { serializeApplication, recommendMissingDocs } from '@/lib/admissions/application-serialize'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'

function editable(mode, status) {
  if (mode !== 'edit') return false
  return status === ADMISSION_STATUS.DRAFT || status === ADMISSION_STATUS.AWAITING_DOCUMENTS
}

async function hydrate(appId) {
  return prisma.admissionApplication.findUnique({
    where: { id: appId },
    include: {
      admissionFaculty: true,
      admissionProgram: true,
      admissionIntake: true,
      documents: { orderBy: { createdAt: 'desc' } },
      timeline: { orderBy: { createdAt: 'asc' }, take: 120 },
      comments: {
        where: { visibility: 'APPLICANT' },
        orderBy: { createdAt: 'desc' },
        take: 40,
      },
      payments: { orderBy: { createdAt: 'desc' } },
    },
  })
}

export async function GET() {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const wb = await resolveApplicantWorkbench(user.id)

  const application = serializeApplication(wb.application)
  const missingDocs = recommendMissingDocs(wb.application)

  return NextResponse.json({
    application,
    applicantMode: wb.mode,
    missingDocs,
    user: {
      email: user.email,
      name: user.name,
      emailVerified: !!user.emailVerifiedAt,
    },
  })
}

const patchSchema = z.object({
  fullName: z.string().trim().min(2).max(200).optional(),
  gender: z.string().trim().max(40).optional(),
  dateOfBirth: z.string().optional().nullable(),
  nationality: z.string().trim().max(120).optional(),
  address: z.string().trim().max(2000).optional(),
  phone: z.string().trim().max(40).optional(),
  previousSchool: z.string().trim().max(500).optional(),
  academicQualifications: z.string().trim().max(8000).optional(),
  nationalExamResults: z.string().trim().max(4000).optional(),
  graduationYear: z.coerce.number().int().min(1970).max(2040).optional().nullable(),
  admissionFacultyId: z.string().optional().nullable(),
  programId: z.string().optional().nullable(),
  intakeId: z.string().optional().nullable(),
  studyMode: z.string().optional().nullable(),
})

export async function PATCH(request) {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const wb = await resolveApplicantWorkbench(user.id)
  if (!editable(wb.mode, wb.application.status)) {
    return NextResponse.json({ error: 'Application is locked for editing' }, { status: 400 })
  }

  const data = { ...parsed.data }
  if (data.dateOfBirth === null) data.dateOfBirth = undefined
  else if (typeof data.dateOfBirth === 'string' && data.dateOfBirth)
    data.dateOfBirth = new Date(data.dateOfBirth)
  else delete data.dateOfBirth

  const updatedRaw = await prisma.admissionApplication.update({
    where: { id: wb.application.id },
    data,
  })

  await prisma.admissionTimelineEvent.create({
    data: {
      applicationId: updatedRaw.id,
      eventType: 'PROFILE_UPDATED',
    },
  })

  const updated = await hydrate(updatedRaw.id)

  return NextResponse.json({
    applicantMode: wb.mode,
    application: serializeApplication(updated),
    missingDocs: updated ? recommendMissingDocs(updated) : [],
  })
}
