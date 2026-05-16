import { redirect } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AdminDashboard from '@/components/AdminDashboard'
import LogoutButton from '@/components/LogoutButton'
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

  return (
    <div data-portal-scope="light" className="min-h-dvh flex flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 flex flex-wrap items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md sm:gap-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Management desk</p>
          <p className="truncate text-[13px] text-slate-700">
            {viewer.name}{' '}
            <span className="font-normal text-slate-500">
              · {roleLabel}
            </span>
          </p>
        </div>
        <span className="hidden max-w-[min(24rem,_40vw)] truncate font-mono text-[11px] text-slate-500 xl:inline">{viewer.email}</span>
        <LogoutButton />
      </header>

      <div className="flex flex-1 flex-col px-4 py-6 lg:px-8 lg:pb-10">
        <div className="mx-auto w-full max-w-[90rem]">
          <AdminDashboard viewer={viewer} users={users} permissionKeys={permissionKeys} viewerRole={viewer.role} />
        </div>
      </div>
    </div>
  )
}
