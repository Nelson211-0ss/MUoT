import { Suspense } from 'react'
import PageLayout from '@/components/PageLayout'
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
    <PageLayout
      title="Student Portal"
      subtitle="Admissions dossier checkpoints, curated tuition postings, and credit-weighted CGPA excerpts — LMS delivery stays in Moodle."
      showBanner={false}
      showCta={false}
      showFooter={false}
    >
      <Suspense fallback={<p className="text-sm text-gray-500 px-1">Loading your workspace…</p>}>
        <StudentPortalShell data={data} permissionKeys={permissionKeys} />
      </Suspense>
    </PageLayout>
  )
}
