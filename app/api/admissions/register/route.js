import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createSessionToken, hashPassword, setSessionCookie } from '@/lib/auth'

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(8).max(40),
})

/** Prospective student signup — creates APPLICANT role + session. */
export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }
    const email = parsed.data.email.toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const applicantRole = await prisma.role.findUnique({ where: { slug: 'APPLICANT' } })
    if (!applicantRole) {
      return NextResponse.json({ error: 'RBAC not initialized — run seed.' }, { status: 503 })
    }

    const passwordHash = await hashPassword(parsed.data.password)
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email,
          name: parsed.data.name,
          passwordHash,
          role: 'APPLICANT',
          emailVerifiedAt: process.env.NODE_ENV !== 'production' ? new Date() : null,
        },
      })
      await tx.userRole.create({ data: { userId: u.id, roleId: applicantRole.id } })
      await tx.admissionApplication.create({
        data: {
          applicantUserId: u.id,
          status: 'DRAFT',
          fullName: parsed.data.name,
          phone: parsed.data.phone,
        },
      })
      return u
    })

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: 'APPLICANT',
    })
    await setSessionCookie(token)

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      devNote:
        process.env.NODE_ENV !== 'production'
          ? 'Email verification simulated as complete in non-production builds.'
          : undefined,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
