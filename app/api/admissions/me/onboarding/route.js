import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'
import { resolveApplicantWorkbench } from '@/lib/admissions/active-application'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'

export async function PATCH() {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const wb = await resolveApplicantWorkbench(user.id)
  const appId = wb.application.id

  if (wb.application.status !== ADMISSION_STATUS.ENROLLED) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  await prisma.admissionApplication.update({
    where: { id: appId },
    data: { onboardingSeenAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}
