import { redirect } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
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
    <PageLayout
      title="Lecturer portal"
      subtitle="Teaching workflows live in Moodle — this desk is for campus identity and light reporting."
      showBanner={false}
      showCta={false}
      showFooter={false}
    >
      <Suspense fallback={<p className="text-sm text-gray-500 px-2">Loading faculty workspace…</p>}>
        <LecturerPortalShell faculty={{ name: user.name, email: user.email }} permissionKeys={permissionKeys} />
      </Suspense>
    </PageLayout>
  )
}
