import { redirect } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Suspense } from 'react'
import LecturerPortalShell from '@/components/portals/LecturerPortalShell'
import { getUserPermissionKeys } from '@/lib/rbac/access'
import { isManagementRoleSlug } from '@/lib/rbac/constants'

export default async function LecturerPortalPage() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect('/login?next=/lecturer-portal')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user) {
    redirect('/login?next=/lecturer-portal')
  }

  const lecturerRole = (user.role ?? '').trim().toUpperCase()
  if (isManagementRoleSlug(lecturerRole)) {
    redirect('/admin')
  }
  if (lecturerRole !== 'LECTURER') {
    redirect(lecturerRole === 'STUDENT' ? '/student-portal' : '/login?next=/lecturer-portal')
  }

  const permissionKeys = await getUserPermissionKeys(user.id)

  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center bg-slate-50"><p className="text-sm text-slate-500">Loading portal…</p></div>}>
      <LecturerPortalShell faculty={{ name: user.name, email: user.email }} permissionKeys={permissionKeys} />
    </Suspense>
  )
}
