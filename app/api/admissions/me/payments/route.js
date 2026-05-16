import crypto from 'node:crypto'

import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'
import { resolveApplicantWorkbench } from '@/lib/admissions/active-application'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { appendTimeline } from '@/lib/admissions/lifecycle'

/** List outstanding admission fee rows for applicant */
export async function GET() {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const wb = await resolveApplicantWorkbench(user.id)
  const pays = wb.application.status === ADMISSION_STATUS.REJECTED ? [] : wb.application.payments
  return NextResponse.json({ payments: pays ?? [] })
}

const START_GATEWAYS = ['SIMULATED', 'STRIPE', 'FLUTTERWAVE', 'MTN_MOMO', 'AIRTEL_MONEY']

/**
 * Applicants record an intent-to-pay checkout (processors are simulated in this build).
 */
export async function POST(request) {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const wb = await resolveApplicantWorkbench(user.id)

  if (wb.application.status !== ADMISSION_STATUS.AWAITING_PAYMENT) {
    return NextResponse.json(
      {
        error: 'Payment instructions activate after your provisional admission is issued.',
      },
      { status: 400 },
    )
  }

  const body = await request.json().catch(() => ({}))
  const gateway = String(body.gateway ?? 'SIMULATED').toUpperCase()

  if (!START_GATEWAYS.includes(gateway)) {
    return NextResponse.json({ error: 'Unsupported payment channel.' }, { status: 400 })
  }

  const existingPending = wb.application.payments?.find((p) => p.status === 'PENDING')
  if (existingPending) {
    return NextResponse.json({ payment: existingPending, reuse: true })
  }

  const payment = await prisma.admissionFeePayment.create({
    data: {
      applicationId: wb.application.id,
      label: `Registration · ${gateway}`,
      amountMinor: 150_000,
      currency: 'SSP',
      status: 'PENDING',
      gateway,
      gatewayRef: gateway === 'SIMULATED' ? `SIM-${crypto.randomBytes(5).toString('hex').toUpperCase()}` : null,
      meta: JSON.stringify({ initiatedByApplicantAt: new Date().toISOString(), gateway }),
    },
  })

  await appendTimeline(wb.application.id, 'FEE_PAYMENT_INITIATED', {
    gateway,
    paymentId: payment.id,
  })

  return NextResponse.json({ payment })
}
