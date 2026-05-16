import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import { ensureLegacyUserRoles, getUserPermissionKeys } from '@/lib/rbac/access'
import { normalizeRoleSlug } from '@/lib/rbac/constants'

/**
 * @param {{ permission?: string }} [opts]
 */
export async function getStudentSessionOrError(opts = {}) {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      student: null,
      permissionKeys: [],
    }
  }

  const student = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  })

  if (!student) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      student: null,
      permissionKeys: [],
    }
  }

  const slug = normalizeRoleSlug(student.role)
  await ensureLegacyUserRoles(student.id, slug)

  const permissionKeys = await getUserPermissionKeys(student.id)

  if (slug !== 'STUDENT') {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), student: null, permissionKeys }
  }

  const need = opts.permission
  if (need && !permissionKeys.includes(need)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), student, permissionKeys }
  }

  return { response: null, student, permissionKeys }
}
