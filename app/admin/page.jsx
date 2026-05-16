import { redirect } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import { getSessionFromCookies } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AdminDashboard from '@/components/AdminDashboard'
import LogoutButton from '@/components/LogoutButton'
import { ensureLegacyUserRoles, getUserPermissionKeys } from '@/lib/rbac/access'
import { isManagementRoleSlug } from '@/lib/rbac/constants'

export default async function AdminPage() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect('/login?next=/admin')
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!viewer) {
    redirect('/login?next=/admin')
  }

  await ensureLegacyUserRoles(viewer.id, viewer.role)

  if (!isManagementRoleSlug(viewer.role)) {
    redirect(
      viewer.role === 'LECTURER'
        ? '/lecturer-portal'
        : viewer.role === 'STUDENT'
          ? '/student-portal'
          : '/login',
    )
  }

  const permissionKeys = await getUserPermissionKeys(viewer.id)

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
    orderBy: { email: 'asc' },
  })
  const ROLE_DISPLAY = {
    ADMIN: 'System Administrator',
    SUPER_ADMIN: 'Super Administrator',
    FINANCE_OFFICER: 'Finance Officer',
    ADMISSIONS_OFFICER: 'Admissions Officer',
    DEPARTMENT_ADMIN: 'Department Administrator',
    ACADEMIC_REGISTRAR: 'Academic Registrar',
  }

  const roleLabel = ROLE_DISPLAY[viewer.role] ?? viewer.role

  return (
    <PageLayout
      title="Management console"
      subtitle="Unified RBAC-backed operations workspace for delegated university staff."
      showBanner={false}
      showCta={false}
      showFooter={false}
    >
      <div className="flex justify-end mb-6">
        <LogoutButton />
      </div>

      <SectionHeader title="Operations" subtitle={`Signed in as ${viewer.name} · ${roleLabel}`} align="left" />

      <p className="text-gray-600 text-sm mb-8">
        <span className="font-semibold text-primary">{viewer.email}</span>
      </p>

      <AdminDashboard viewer={viewer} users={users} permissionKeys={permissionKeys} viewerRole={viewer.role} />
    </PageLayout>
  )
}
