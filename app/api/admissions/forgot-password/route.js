import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

import { OTP_PURPOSES } from '@/lib/admissions/constants'
import { issueOtp } from '@/lib/admissions/otp'

export async function POST(request) {
  const email = await readEmail(request)
  /** Always acknowledge to avoid leaking account existence — unless invalid email format */
  const fakeOk = NextResponse.json({ ok: true, message: 'If an applicant account matches, OTP instructions ship shortly.' })

  if (!email) return fakeOk

  const applicant = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { role: true, email: true },
  })

  if (!applicant || applicant.role !== 'APPLICANT') {
    await new Promise((r) => setTimeout(r, 200))
    return fakeOk
  }

  const { plain } = await issueOtp(applicant.email, OTP_PURPOSES.RESET_PASSWORD, 20)

  if (process.env.NODE_ENV !== 'production' && plain !== undefined) {
    return NextResponse.json({
      ok: true,
      message: 'Non-production OTP (remove in production emailing).',
      debugCode: plain,
    })
  }

  return fakeOk
}

async function readEmail(request) {
  const body = await request.json().catch(() => ({}))
  const raw = String(body.email ?? '')
    .trim()
    .toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return ''
  return raw
}
