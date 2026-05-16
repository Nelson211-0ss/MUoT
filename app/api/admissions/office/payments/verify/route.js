import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

import { forbidUnlessAny, getAdmissionOfficeCtx } from '@/lib/admissions/office-guard'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { appendTimeline, notifyApplicant } from '@/lib/admissions/lifecycle'
import { P } from '@/lib/rbac/constants'

const PERMS = [P.ADMISSIONS_FINANCE_PAYMENT, P.FINANCE_MANAGE]

export async function POST(request) {
  const { response, admin, permissionKeys } = await getAdmissionOfficeCtx()
  if (response) return response

  const gate = forbidUnlessAny(permissionKeys, PERMS)
  if (gate) return gate

  const body = await request.json()
  const paymentId = String(body.paymentId ?? '')
  if (!paymentId) return NextResponse.json({ error: 'paymentId required.' }, { status: 400 })

  const payment = await prisma.admissionFeePayment.findUnique({
    where: { id: paymentId },
    include: { application: true },
  })
  if (!payment) return NextResponse.json({ error: 'Payment not found.' }, { status: 404 })

  if (payment.application.status !== ADMISSION_STATUS.AWAITING_PAYMENT) {
    return NextResponse.json({ error: 'Application must be awaiting payment verification.' }, { status: 400 })
  }

  await prisma.admissionFeePayment.update({
    where: { id: paymentId },
    data: {
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedById: admin?.id ?? undefined,
      gatewayRef:
        payment.gatewayRef ||
        `VER-${payment.gateway}-${Date.now().toString(36).toUpperCase()}`,
    },
  })

  await appendTimeline(payment.applicationId, 'REGISTRATION_FEE_VERIFIED', {
    actor: admin?.id,
    gateway: payment.gateway,
  })

  await notifyApplicant(
    payment.application.applicantUserId,
    'Fees confirmed',
    'Finance has cleared your provisional registration levy. Registrar will finalize onboarding shortly.',
    { paymentId },
  )

  return NextResponse.json({ ok: true })
}
