import prisma from '@/lib/prisma'

/** Effective permission keys derived from JWT primary role linkage (via user_roles → role_permissions). */
export async function getUserPermissionKeys(userId) {
  const rows = await prisma.userRole.findMany({
    where: { userId },
    select: {
      role: {
        select: {
          rolePermissions: {
            select: {
              permission: { select: { key: true } },
            },
          },
        },
      },
    },
  })
  const keys = new Set()
  for (const ur of rows) {
    for (const rp of ur.role.rolePermissions) {
      keys.add(rp.permission.key)
    }
  }
  return [...keys].sort()
}

/** Role slugs linked to this user profile. */
export async function getUserRoleSlugs(userId) {
  const rows = await prisma.userRole.findMany({
    where: { userId },
    include: { role: { select: { slug: true } } },
  })
  return rows.map((u) => u.role.slug).sort()
}

/** One-time linkage for deployments where users exist before RBAC junction rows. */
export async function ensureLegacyUserRoles(userId, fallbackRoleSlug) {
  const n = await prisma.userRole.count({ where: { userId } })
  if (n > 0) return
  const slug = String(fallbackRoleSlug ?? 'STUDENT')
    .trim()
    .toUpperCase()
  const role = await prisma.role.findUnique({ where: { slug } })
  if (!role) return
  await prisma.userRole.create({ data: { userId, roleId: role.id } })
}
