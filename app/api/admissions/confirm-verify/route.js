import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

import { getApplicantOrError } from '@/lib/applicantAuth'
import { OTP_PURPOSES } from '@/lib/admissions/constants'
import { consumeOtp } from '@/lib/admissions/otp'

export async function POST(request) {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const body = await request.json()
  const code = String(body.code ?? '').trim()
  if (code.length < 4 || code.length > 12) {
    return NextResponse.json({ error: 'Invalid OTP code.' }, { status: 400 })
  }

  const ok = await consumeOtp(user.email, OTP_PURPOSES.EMAIL_VERIFY, code)
  if (!ok) {
    return NextResponse.json({ error: 'Code expired or incorrect.' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}
