import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { getManagementSessionOrError, isSystemAdministratorRole, ROLES } from '@/lib/adminAuth'
import { P } from '@/lib/rbac/constants'
import { writeAuditLog } from '@/lib/audit'

const createUserSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(128),
  role: z.enum([ROLES.STUDENT, ROLES.LECTURER]),
})

export async function POST(request) {
  const { response, admin, permissionKeys } = await getManagementSessionOrError()
  if (response) return response
  if (!permissionKeys.includes(P.USERS_MANAGE)) {
    return NextResponse.json({ error: 'Forbidden — provisioning requires user-management scope' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }
    const { email, name, password, role } = parsed.data

    if (role === ROLES.STUDENT && !isSystemAdministratorRole(admin.role)) {
      return NextResponse.json(
        { error: 'Only system administrators may create learner (student) accounts.' },
        { status: 403 },
      )
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const rbacRole = await prisma.role.findUnique({ where: { slug: role } })
    if (!rbacRole) {
      return NextResponse.json({ error: 'RBAC misconfigured — role missing from directory' }, { status: 500 })
    }

    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          passwordHash,
          role,
        },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      })
      await tx.userRole.create({ data: { userId: u.id, roleId: rbacRole.id } })
      return u
    })

    void writeAuditLog({
      userId: admin.id,
      action: 'management.user.create',
      resource: `user:${user.id}`,
      meta: { createdEmail: user.email, createdRole: user.role },
      request,
    }).catch(() => {})

    return NextResponse.json({ ok: true, user })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Could not create user' }, { status: 500 })
  }
}

export async function GET() {
  const { response, permissionKeys } = await getManagementSessionOrError()
  if (response) return response
  const canFullUserDirectory =
    permissionKeys.includes(P.USERS_VIEW) || permissionKeys.includes(P.USERS_MANAGE)
  const studentRosterScopeOnly =
    permissionKeys.includes(P.STUDENTS_REGISTRY_VIEW) && !canFullUserDirectory

  if (!canFullUserDirectory && !studentRosterScopeOnly) {
    return NextResponse.json({ error: 'Forbidden — insufficient directory scope' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    where: studentRosterScopeOnly ? { role: 'STUDENT' } : {},
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      studentLoginNumber: true,
      createdAt: true,
    },
    orderBy: { email: 'asc' },
  })
  return NextResponse.json({ users })
}
