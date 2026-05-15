import prisma from '@/lib/prisma'

/** Create PENDING AssignmentProgress rows for every assignment in course (for newly enrolled student). */
export async function syncProgressForNewEnrollment(userId, courseId) {
  const assignments = await prisma.assignment.findMany({ where: { courseId }, select: { id: true } })
  for (const a of assignments) {
    await prisma.assignmentProgress.upsert({
      where: {
        userId_assignmentId: { userId, assignmentId: a.id },
      },
      create: { userId, assignmentId: a.id, status: 'PENDING' },
      update: {},
    })
  }
}

/** When lecturer adds an assignment: progress rows for all enrolled students. */
export async function syncProgressForNewAssignment(courseId, assignmentId) {
  const enrollments = await prisma.enrollment.findMany({ where: { courseId }, select: { userId: true } })
  for (const e of enrollments) {
    await prisma.assignmentProgress.upsert({
      where: {
        userId_assignmentId: { userId: e.userId, assignmentId },
      },
      create: { userId: e.userId, assignmentId, status: 'PENDING' },
      update: {},
    })
  }
}

export async function removeProgressForUnenrollment(userId, courseId) {
  const assignmentIds = await prisma.assignment.findMany({
    where: { courseId },
    select: { id: true },
  })
  const ids = assignmentIds.map((a) => a.id)
  if (ids.length === 0) return
  await prisma.assignmentProgress.deleteMany({
    where: {
      userId,
      assignmentId: { in: ids },
    },
  })
}
