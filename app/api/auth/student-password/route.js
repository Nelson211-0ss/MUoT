import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { hashPassword, verifyPassword, getSessionFromCookies } from '@/lib/auth'

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(200),
})

export async function POST(request) {
  try {
    const session = await getSessionFromCookies()
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        role: true,
        passwordHash: true,
        studentLoginNumber: true,
        studentPasswordConfigured: true,
      },
    })

    if (!user || String(user.role ?? '').trim().toUpperCase() !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!user.studentLoginNumber || user.studentPasswordConfigured !== false) {
      return NextResponse.json({ error: 'Password onboarding is not required.' }, { status: 400 })
    }

    const json = await request.json().catch(() => ({}))
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Provide current and new passwords (new ≥ 8 chars).' }, { status: 400 })
    }

    const { currentPassword, newPassword } = parsed.data
    const ok = await verifyPassword(currentPassword, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(newPassword),
        studentPasswordConfigured: true,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Unable to save password.' }, { status: 500 })
  }
}
