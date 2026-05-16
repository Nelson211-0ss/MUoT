import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'
import { resolveApplicantWorkbench } from '@/lib/admissions/active-application'
import { serializeApplication, recommendMissingDocs } from '@/lib/admissions/application-serialize'
import { ADMISSION_STATUS, DOC_TYPES } from '@/lib/admissions/constants'
import { appendTimeline, notifyApplicant } from '@/lib/admissions/lifecycle'

export async function POST() {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const wb = await resolveApplicantWorkbench(user.id)
  const app = wb.application

  if (
    wb.mode !== 'edit' ||
    (app.status !== ADMISSION_STATUS.DRAFT && app.status !== ADMISSION_STATUS.AWAITING_DOCUMENTS)
  ) {
    return NextResponse.json({ error: 'Submission is not permitted for this pipeline state.' }, { status: 400 })
  }

  const requiredPresence = Boolean(
    app.fullName?.trim() &&
      app.phone?.trim() &&
      app.nationality?.trim() &&
      app.address?.trim() &&
      app.admissionFacultyId &&
      app.programId &&
      app.intakeId &&
      app.studyMode?.trim(),
  )
  if (!requiredPresence) {
    return NextResponse.json(
      { error: 'Please complete all required profile and program selections before submitting.' },
      { status: 400 },
    )
  }

  const docTypesFound = new Set((app.documents ?? []).map((d) => d.docType))
  if (!docTypesFound.has(DOC_TYPES.TRANSCRIPT) || !docTypesFound.has(DOC_TYPES.ID)) {
    return NextResponse.json(
      { error: 'Upload your academic transcript and identification document.' },
      { status: 400 },
    )
  }

  const updated = await prisma.admissionApplication.update({
    where: { id: app.id },
    data: {
      status: ADMISSION_STATUS.SUBMITTED,
      submittedAt: new Date(),
    },
  })

  await appendTimeline(updated.id, 'APPLICATION_SUBMITTED', { applicantUserId: user.id })
  await notifyApplicant(
    user.id,
    'Application received',
    `${app.fullName?.split?.(' ')?.[0] ?? 'Applicant'}, we've received your MUT admissions package.`,
    { applicationId: updated.id },
  )

  const full = await prisma.admissionApplication.findUnique({
    where: { id: updated.id },
    include: {
      admissionFaculty: true,
      admissionProgram: true,
      admissionIntake: true,
      documents: true,
      timeline: { orderBy: { createdAt: 'asc' }, take: 120 },
      comments: true,
      payments: true,
    },
  })

  return NextResponse.json({
    applicantMode: 'view',
    application: serializeApplication(full),
    missingDocs: full ? recommendMissingDocs(full) : [],
  })
}
