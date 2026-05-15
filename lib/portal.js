import prisma from '@/lib/prisma'

export async function getPortalDashboard(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  })
  if (!user) return null

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          assignments: {
            include: {
              progress: {
                where: { userId: user.id },
              },
            },
          },
        },
      },
    },
  })

  const courses = enrollments.map((e) => ({
    id: e.course.id,
    code: e.course.code,
    title: e.course.title,
    assignments: e.course.assignments.map((a) => {
      const p = a.progress[0]
      return {
        id: a.id,
        title: a.title,
        dueDate: a.dueDate.toISOString(),
        status: p?.status ?? 'PENDING',
        grade: p?.grade ?? null,
      }
    }),
  }))

  const pendingAssignments =
    courses.flatMap((c) => c.assignments.filter((a) => a.status === 'PENDING')).length

  const completedGrades = courses.flatMap((c) =>
    c.assignments.filter((a) => a.grade != null).map((a) => a.grade),
  )
  const avgGrade =
    completedGrades.length > 0
      ? Math.round(completedGrades.reduce((s, g) => s + g, 0) / completedGrades.length)
      : null

  return {
    user,
    summary: {
      courseCount: courses.length,
      pendingAssignments,
      averageGrade: avgGrade,
    },
    courses,
  }
}
