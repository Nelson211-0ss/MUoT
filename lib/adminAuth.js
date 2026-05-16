import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import { ensureLegacyUserRoles, getUserPermissionKeys } from '@/lib/rbac/access'
import { MANAGEMENT_ROLE_SLUGS, normalizeRoleSlug } from '@/lib/rbac/constants'

/** Create-user API still limits self-service provisioning to learner + faculty personas. */
export const ROLES = {
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
}

/**
 * Any elevated staff persona that enters /admin receives this guard + hydrated permissionKeys.
 */
export async function getManagementSessionOrError() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      admin: null,
      permissionKeys: [],
    }
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!admin) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      admin: null,
      permissionKeys: [],
    }
  }

  const slug = normalizeRoleSlug(admin.role)
  await ensureLegacyUserRoles(admin.id, slug)
  const permissionKeys = await getUserPermissionKeys(admin.id)

  if (!MANAGEMENT_ROLE_SLUGS.has(slug)) {
    return {
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      admin: null,
      permissionKeys: [],
    }
  }

  return { response: null, admin, permissionKeys }
}

/** Backwards compatible alias for existing API routes under /api/admin. */
export async function getAdminOrError() {
  return getManagementSessionOrError()
}
