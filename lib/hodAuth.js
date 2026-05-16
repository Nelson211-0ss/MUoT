import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import { ensureLegacyUserRoles, getUserPermissionKeys } from '@/lib/rbac/access'
import { HOD_ROLE_SLUG, normalizeRoleSlug } from '@/lib/rbac/constants'

/**
 * @param {{ permission?: string }} [opts]
 */
export async function getHodSessionOrError(opts = {}) {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), hod: null, permissionKeys: [] }
  }

  const hod = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!hod) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), hod: null, permissionKeys: [] }
  }

  const slug = normalizeRoleSlug(hod.role)
  await ensureLegacyUserRoles(hod.id, slug)

  const permissionKeys = await getUserPermissionKeys(hod.id)

  if (slug !== normalizeRoleSlug(HOD_ROLE_SLUG)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), hod: null, permissionKeys: [] }
  }

  const need = opts.permission
  if (need && !permissionKeys.includes(need)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), hod: null, permissionKeys }
  }

  return { response: null, hod, permissionKeys }
}
