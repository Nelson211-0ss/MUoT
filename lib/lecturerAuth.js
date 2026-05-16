import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import { ensureLegacyUserRoles, getUserPermissionKeys } from '@/lib/rbac/access'
import { normalizeRoleSlug, P } from '@/lib/rbac/constants'

export async function getLecturerOrError() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), lecturer: null, permissionKeys: [] }
  }
  const lecturer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!lecturer) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), lecturer: null, permissionKeys: [] }
  }

  const slug = normalizeRoleSlug(lecturer.role)
  await ensureLegacyUserRoles(lecturer.id, slug)
  const permissionKeys = await getUserPermissionKeys(lecturer.id)

  if (slug !== 'LECTURER') {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), lecturer: null, permissionKeys: [] }
  }

  if (!permissionKeys.includes(P.LECTURER_PORTAL)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), lecturer: null, permissionKeys: [] }
  }

  return { response: null, lecturer, permissionKeys }
}
