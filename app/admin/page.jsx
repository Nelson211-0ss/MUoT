import { redirect } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AdminDashboard from '@/components/AdminDashboard'
import AdmissionsDeskPage from '@/components/admin/AdmissionsDeskPage'
import { ensureLegacyUserRoles, getUserPermissionKeys } from '@/lib/rbac/access'
import { P, isManagementRoleSlug } from '@/lib/rbac/constants'

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

  const canFullUserDirectory =
    permissionKeys.includes(P.USERS_VIEW) || permissionKeys.includes(P.USERS_MANAGE)
  const studentRosterScopeOnly =
    permissionKeys.includes(P.STUDENTS_REGISTRY_VIEW) && !canFullUserDirectory

  const users = await prisma.user.findMany({
    where: studentRosterScopeOnly ? { role: 'STUDENT' } : {},
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      studentLoginNumber: true,
    },
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
  const admissionsDeskOnly = viewer.role === 'ACADEMIC_REGISTRAR' || viewer.role === 'ADMISSIONS_OFFICER'

  if (admissionsDeskOnly) {
    return (
      <AdmissionsDeskPage
        viewer={viewer}
        users={users}
        permissionKeys={permissionKeys}
        roleLabel={roleLabel}
      />
    )
  }

  return (
    <AdminDashboard
      viewer={viewer}
      users={users}
      permissionKeys={permissionKeys}
      viewerRole={viewer.role}
      roleLabel={roleLabel}
    />
  )
}
