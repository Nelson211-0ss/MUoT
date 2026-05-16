import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import { ensureLegacyUserRoles, getUserPermissionKeys, getUserRoleSlugs } from '@/lib/rbac/access'

export async function GET() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return NextResponse.json({ user: null, roles: [], permissionKeys: [] }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!user) {
    return NextResponse.json({ user: null, roles: [], permissionKeys: [] }, { status: 401 })
  }

  await ensureLegacyUserRoles(user.id, user.role)
  const [roles, permissionKeys] = await Promise.all([
    getUserRoleSlugs(user.id),
    getUserPermissionKeys(user.id),
  ])

  return NextResponse.json({ user, roles, permissionKeys })
}
