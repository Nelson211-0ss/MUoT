import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import { ensureLegacyUserRoles } from '@/lib/rbac/access'
import { normalizeRoleSlug, isHoDRoleSlug, isManagementRoleSlug } from '@/lib/rbac/constants'

export default async function HodPortalLayout({ children }) {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect('/login?next=/hod-portal')
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  })

  if (!viewer) redirect('/login?next=/hod-portal')

  const slug = normalizeRoleSlug(viewer.role)
  await ensureLegacyUserRoles(session.userId, slug)

  if (isManagementRoleSlug(slug)) redirect('/admin')
  if (slug === 'STUDENT') redirect('/student-portal')
  if (slug === 'APPLICANT') redirect('/applicant-portal/application')
  if (slug === 'LECTURER') redirect('/lecturer-portal')

  if (!isHoDRoleSlug(slug)) {
    redirect('/login')
  }

  return children
}
