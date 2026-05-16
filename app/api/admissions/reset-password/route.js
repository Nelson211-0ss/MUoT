import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

import { hashPassword } from '@/lib/auth'
import { OTP_PURPOSES } from '@/lib/admissions/constants'
import { consumeOtp } from '@/lib/admissions/otp'

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const email = String(body.email ?? '')
    .trim()
    .toLowerCase()
  const password = String(body.password ?? '')
  const code = String(body.code ?? '').trim()

  if (!email || password.length < 8 || password.length > 160 || code.length < 6) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  })

  if (!user || user.role !== 'APPLICANT') {
    return NextResponse.json({ error: 'Unable to reset this account.' }, { status: 400 })
  }

  const ok = await consumeOtp(email, OTP_PURPOSES.RESET_PASSWORD, code)
  if (!ok) {
    return NextResponse.json({ error: 'OTP invalid or expired.' }, { status: 400 })
  }

  const passwordHash = await hashPassword(password)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  })

  return NextResponse.json({ ok: true })
}
