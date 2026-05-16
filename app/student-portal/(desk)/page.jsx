import { Suspense } from 'react'
import { getSessionFromCookies } from '@/lib/auth'
import { getPortalDashboard } from '@/lib/portal'
import { getUserPermissionKeys } from '@/lib/rbac/access'
import StudentPortalShell from '@/components/portals/StudentPortalShell'

import { redirect } from 'next/navigation'

export default async function StudentDeskHomePage() {
  const session = await getSessionFromCookies()
  const userId = session?.userId
  if (!userId) {
    redirect('/login?next=/student-portal')
  }

  const [data, permissionKeys] = await Promise.all([getPortalDashboard(userId), getUserPermissionKeys(userId)])
  if (!data) {
    redirect('/login?next=/student-portal')
  }

  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center bg-slate-50"><p className="text-sm text-slate-500">Loading portal…</p></div>}>
      <StudentPortalShell data={data} permissionKeys={permissionKeys} />
    </Suspense>
  )
}
