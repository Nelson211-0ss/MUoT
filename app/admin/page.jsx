import { redirect } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import { getSessionFromCookies } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AdminDashboard from '@/components/AdminDashboard'
import LogoutButton from '@/components/LogoutButton'

export default async function AdminPage() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect('/login?next=/admin')
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!viewer || viewer.role !== 'ADMIN') {
    redirect(
      viewer?.role === 'LECTURER'
        ? '/lecturer-portal'
        : viewer?.role === 'STUDENT'
          ? '/student-portal'
          : '/login',
    )
  }

  const [users, coursesRaw, enrollmentsRaw] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
      orderBy: { email: 'asc' },
    }),
    prisma.course.findMany({
      orderBy: { code: 'asc' },
      include: {
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.enrollment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, code: true, title: true } },
      },
      orderBy: [{ courseId: 'asc' }, { userId: 'asc' }],
    }),
  ])

  const courses = coursesRaw.map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    lecturerId: c.lecturerId,
    _count: c._count,
  }))

  const enrollments = enrollmentsRaw.map((e) => ({
    id: e.id,
    user: e.user,
    course: e.course,
  }))

  return (
    <PageLayout
      title="Administration"
      subtitle="Provision lecturers, enroll students, and manage course staff."
      showBanner={false}
      showCta={false}
      showFooter={false}
    >
      <div className="flex justify-end mb-6">
        <LogoutButton />
      </div>

      <SectionHeader title="System admin" subtitle={`Signed in as ${viewer.name}`} align="left" />

      <p className="text-gray-600 text-sm mb-8">
        <span className="font-semibold text-primary">{viewer.email}</span>
      </p>

      <AdminDashboard users={users} courses={courses} enrollments={enrollments} />
    </PageLayout>
  )
}
