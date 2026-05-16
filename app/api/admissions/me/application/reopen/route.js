import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'
import { getLatestRejectedApplication } from '@/lib/admissions/active-application'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { appendTimeline } from '@/lib/admissions/lifecycle'

export async function POST() {
  const { response, user } = await getApplicantOrError()
  if (response) return response

  const blocker = await prisma.admissionApplication.findFirst({
    where: {
      applicantUserId: user.id,
      status: { notIn: [ADMISSION_STATUS.REJECTED] },
    },
  })
  if (blocker) {
    return NextResponse.json({ error: 'Finish or withdraw your existing application cycle first.' }, { status: 400 })
  }

  const rej = await getLatestRejectedApplication(user.id)
  if (!rej) {
    return NextResponse.json({ error: 'No rejected application on file.' }, { status: 400 })
  }

  const created = await prisma.admissionApplication.create({
    data: {
      applicantUserId: user.id,
      status: ADMISSION_STATUS.DRAFT,
      fullName: user.name,
      phone: null,
      academicQualifications: null,
      nationalExamResults: null,
      previousSchool: null,
      graduationYear: null,
    },
  })

  await appendTimeline(created.id, 'REAPPLICATION_STARTED', {
    previousCycleId: rej.id,
    priorStatus: rej.status,
  })

  return NextResponse.json({ ok: true, applicationId: created.id })
}
