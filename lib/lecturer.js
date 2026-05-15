import prisma from '@/lib/prisma'

export async function assertLecturerOwnsCourse(lecturerId, courseId) {
  return prisma.course.findFirst({
    where: { id: courseId, lecturerId },
  })
}
