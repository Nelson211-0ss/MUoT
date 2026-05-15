import { redirect } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import { getSessionFromCookies } from '@/lib/auth'
import prisma from '@/lib/prisma'
import LecturerPortalWorkspace from '@/components/LecturerPortalWorkspace'
import LogoutButton from '@/components/LogoutButton'

export default async function LecturerPortalPage() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect('/login?next=/lecturer-portal')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user || user.role !== 'LECTURER') {
    redirect(
      user?.role === 'ADMIN' ? '/admin' : user?.role === 'STUDENT' ? '/student-portal' : '/login?next=/lecturer-portal',
    )
  }

  const coursesRaw = await prisma.course.findMany({
    where: { lecturerId: user.id },
    orderBy: { code: 'asc' },
    include: {
      materials: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          fileName: true,
          sizeBytes: true,
          createdAt: true,
        },
      },
      announcements: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, body: true, createdAt: true },
      },
      enrollments: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      assignments: {
        orderBy: { dueDate: 'asc' },
        include: {
          progress: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
    },
  })

  const courses = coursesRaw.map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    materials: c.materials.map((m) => ({
      id: m.id,
      title: m.title,
      fileName: m.fileName,
      sizeBytes: m.sizeBytes,
      createdAt: m.createdAt.toISOString(),
    })),
    announcements: c.announcements.map((an) => ({
      id: an.id,
      title: an.title,
      body: an.body,
      createdAt: an.createdAt.toISOString(),
    })),
    roster: c.enrollments.map((e) => ({
      id: e.user.id,
      name: e.user.name,
      email: e.user.email,
    })),
    assignments: c.assignments.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      maxPoints: a.maxPoints,
      dueDate: a.dueDate.toISOString(),
      progress: a.progress.map((p) => ({
        progressId: p.id,
        studentName: p.user.name,
        studentEmail: p.user.email,
        status: p.status,
        grade: p.grade,
        feedback: p.feedback,
        submittedAt: p.submittedAt?.toISOString() ?? null,
        submissionFileName: p.submissionFileName,
        hasSubmission: !!p.submissionStoredPath,
      })),
    })),
  }))

  return (
    <PageLayout
      title="Lecturer portal"
      subtitle="Manage materials, announcements, assessments, grades, and your class roster."
      showBanner={false}
      showCta={false}
      showFooter={false}
    >
      <div className="flex justify-end mb-6">
        <LogoutButton />
      </div>

      <SectionHeader title="Dashboard" subtitle={`Signed in as ${user.name}`} align="left" />

      <p className="text-gray-600 text-sm mb-8">
        <span className="font-semibold text-primary">{user.email}</span>
      </p>

      <LecturerPortalWorkspace courses={courses} />
    </PageLayout>
  )
}
