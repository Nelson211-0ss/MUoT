import { redirect } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import { getSessionFromCookies } from '@/lib/auth'
import { getPortalDashboard } from '@/lib/portal'
import StudentPortalDashboard from '@/components/StudentPortalDashboard'
import LogoutButton from '@/components/LogoutButton'

export default async function StudentPortalPage() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect('/login?next=/student-portal')
  }

  const data = await getPortalDashboard(session.userId)
  if (!data) {
    redirect('/login?next=/student-portal')
  }

  return (
    <PageLayout
      title="Student Portal"
      subtitle="Your hub for courses, assignments, grades, and campus updates."
    >
      <div className="flex justify-end mb-6">
        <LogoutButton />
      </div>
      <SectionHeader
        title="Dashboard"
        subtitle={`Welcome back, ${data.user.name}.`}
        align="left"
      />

      <StudentPortalDashboard data={data} />
    </PageLayout>
  )
}
