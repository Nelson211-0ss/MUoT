import { NextResponse } from 'next/server'

import { getApplicantOrError } from '@/lib/applicantAuth'
import { OTP_PURPOSES } from '@/lib/admissions/constants'
import { issueOtp } from '@/lib/admissions/otp'

/** Email verification OTP requested by authenticated applicants. */
export async function POST() {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, message: 'Email already verified.' })
  }

  const { expiresAt, plain } = await issueOtp(user.email, OTP_PURPOSES.EMAIL_VERIFY, 25)

  return NextResponse.json({
    ok: true,
    expiresAt,
    ...(process.env.NODE_ENV !== 'production' && plain !== undefined ? { debugCode: plain } : {}),
  })
}
