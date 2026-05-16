import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createSessionToken, setSessionCookie, verifyPassword } from '@/lib/auth'
import { writeAuditLog } from '@/lib/audit'

const TEN_DIGITS = /^\d{10}$/

const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(200),
  password: z.string().min(1),
})

async function locateUser(trimmedRaw) {
  const emailGuess = trimmedRaw.trim().toLowerCase()

  const byEmail = await prisma.user.findUnique({
    where: { email: emailGuess },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      passwordHash: true,
      studentLoginNumber: true,
      studentPasswordConfigured: true,
    },
  })
  if (byEmail) return byEmail

  const normalizedDigits = trimmedRaw.trim()
  if (TEN_DIGITS.test(normalizedDigits)) {
    return prisma.user.findUnique({
      where: { studentLoginNumber: normalizedDigits },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        studentLoginNumber: true,
        studentPasswordConfigured: true,
      },
    })
  }

  return null
}

export async function POST(request) {
  try {
    const body = await request.json()
    const identifierInput = typeof body.identifier === 'string' ? body.identifier : typeof body.email === 'string' ? body.email : ''

    const parsed = loginSchema.safeParse({
      identifier: identifierInput,
      password: String(body.password ?? ''),
    })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Student number / email and password are required.' }, { status: 400 })
    }

    const { identifier, password } = parsed.data

    const user = await locateUser(identifier)
    if (!user) {
      return NextResponse.json({ error: 'Unknown student number / email or invalid password.' }, { status: 401 })
    }

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Unknown student number / email or invalid password.' }, { status: 401 })
    }

    const role = String(user.role ?? 'STUDENT').trim().toUpperCase()

    const mustChoosePassword =
      role === 'STUDENT' && Boolean(user.studentLoginNumber) && user.studentPasswordConfigured === false

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    await setSessionCookie(token)

    void writeAuditLog({
      userId: user.id,
      action: 'auth.login.success',
      resource: `user:${user.id}`,
      meta: { identifier: identifier.trim(), role },
      request,
    }).catch(() => {})

    return NextResponse.json({
      ok: true,
      mustChoosePassword,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentLoginNumber: user.studentLoginNumber,
      },
    })
  } catch (e) {
    console.error(e)
    if (e?.code === 'P2022') {
      return NextResponse.json(
        {
          error:
            'Database schema is out of date. Run npm run db:push; if SQLite still has legacy Course/Assignment tables Prisma asks to drop, run: npx prisma db push --accept-data-loss — then optionally npm run db:seed for demo accounts.',
        },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
