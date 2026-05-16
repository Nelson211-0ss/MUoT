import { redirect } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import { getSessionFromCookies } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Suspense } from 'react'
import LecturerPortalShell from '@/components/portals/LecturerPortalShell'

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
  if (lecturerRole !== 'LECTURER') {
    redirect(
      lecturerRole === 'ADMIN' ? '/admin' : lecturerRole === 'STUDENT' ? '/student-portal' : '/login?next=/lecturer-portal',
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
    <PageLayout title="Lecturer portal" subtitle="Teaching desk connected to admissions and LMS." showBanner={false} showCta={false} showFooter={false}>
      <Suspense fallback={<p className="text-sm text-gray-500 px-2">Loading faculty workspace…</p>}>
        <LecturerPortalShell courses={courses} faculty={{ name: user.name, email: user.email }} />
      </Suspense>
    </PageLayout>
  )
}
