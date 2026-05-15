import prisma from '@/lib/prisma'

const ANNOUNCEMENTS_PER_COURSE = 25

/**
 * Loads the student dashboard using smaller queries grouped in JS so SQLite avoids
 * deep nested joins (often hits variable limits / engine instability).
 */
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
        select: { id: true, code: true, title: true },
      },
    },
  })

  const courseIds = enrollments.map((e) => e.course.id)

  if (courseIds.length === 0) {
    return {
      user,
      summary: { courseCount: 0, pendingAssignments: 0, averageGrade: null },
      courses: [],
    }
  }

  const [assignmentRows, materialRows, announcementRows] = await Promise.all([
    prisma.assignment.findMany({
      where: { courseId: { in: courseIds } },
      orderBy: { dueDate: 'asc' },
      select: {
        id: true,
        courseId: true,
        title: true,
        description: true,
        maxPoints: true,
        dueDate: true,
        progress: {
          where: { userId: user.id },
        },
      },
    }),
    prisma.courseMaterial.findMany({
      where: { courseId: { in: courseIds } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        courseId: true,
        title: true,
        fileName: true,
        sizeBytes: true,
        createdAt: true,
      },
    }),
    prisma.announcement.findMany({
      where: { courseId: { in: courseIds } },
      select: {
        id: true,
        courseId: true,
        title: true,
        body: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    }),
  ])

  const assignmentsByCourse = new Map()
  for (const a of assignmentRows) {
    let list = assignmentsByCourse.get(a.courseId)
    if (!list) {
      list = []
      assignmentsByCourse.set(a.courseId, list)
    }
    list.push(a)
  }
  for (const [, list] of assignmentsByCourse) {
    list.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  const materialsByCourse = new Map()
  for (const m of materialRows) {
    let list = materialsByCourse.get(m.courseId)
    if (!list) {
      list = []
      materialsByCourse.set(m.courseId, list)
    }
    list.push(m)
  }
  for (const [, list] of materialsByCourse) {
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const announcementsByCourse = new Map()
  const announcementsRawByCourse = new Map()
  for (const an of announcementRows) {
    let bucket = announcementsRawByCourse.get(an.courseId)
    if (!bucket) {
      bucket = []
      announcementsRawByCourse.set(an.courseId, bucket)
    }
    bucket.push(an)
  }
  for (const [cid, bucket] of announcementsRawByCourse) {
    bucket.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    announcementsByCourse.set(cid, bucket.slice(0, ANNOUNCEMENTS_PER_COURSE))
  }

  const courses = enrollments.map((e) => {
    const cid = e.course.id
    const assignments = assignmentsByCourse.get(cid) ?? []
    const materials = materialsByCourse.get(cid) ?? []
    const announcements = announcementsByCourse.get(cid) ?? []

    return {
      id: e.course.id,
      code: e.course.code,
      title: e.course.title,
      announcements: announcements.map((an) => ({
        id: an.id,
        title: an.title,
        body: an.body,
        authorName: an.author?.name ?? 'Instructor',
        createdAt: an.createdAt.toISOString(),
      })),
      assignments: assignments.map((a) => {
        const p = a.progress[0]
        const due = new Date(a.dueDate)
        const submitted = p?.submittedAt ? new Date(p.submittedAt) : null
        const late = !!(submitted && submitted > due)
        return {
          id: a.id,
          progressId: p?.id ?? null,
          title: a.title,
          description: a.description ?? null,
          maxPoints: a.maxPoints,
          dueDate: a.dueDate.toISOString(),
          status: p?.status ?? 'PENDING',
          grade: p?.grade ?? null,
          feedback: p?.feedback ?? null,
          submittedAt: p?.submittedAt?.toISOString() ?? null,
          submissionFileName: p?.submissionFileName ?? null,
          hasSubmission: !!(p?.submissionStoredPath),
          late,
        }
      }),
      materials: materials.map((m) => ({
        id: m.id,
        title: m.title,
        fileName: m.fileName,
        sizeBytes: m.sizeBytes,
        createdAt: m.createdAt.toISOString(),
      })),
    }
  })

  const todoCount = courses
    .flatMap((c) => c.assignments.filter((a) => a.grade == null && !a.hasSubmission))
    .length

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
      pendingAssignments: todoCount,
      averageGrade: avgGrade,
    },
    courses,
  }
}
