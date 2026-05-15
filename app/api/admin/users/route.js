import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { getAdminOrError, ROLES } from '@/lib/adminAuth'

const createUserSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(128),
  role: z.enum([ROLES.STUDENT, ROLES.LECTURER]),
})

export async function POST(request) {
  const { response, admin } = await getAdminOrError()
  if (response) return response

  try {
    const body = await request.json()
    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }
    const { email, name, password, role } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        role,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    return NextResponse.json({ ok: true, user })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Could not create user' }, { status: 500 })
  }
}

export async function GET() {
  const { response } = await getAdminOrError()
  if (response) return response

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { email: 'asc' },
  })
  return NextResponse.json({ users })
}
