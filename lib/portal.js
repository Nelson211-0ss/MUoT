import prisma from '@/lib/prisma'

/**
 * Student desk payload (admissions, fees, results surfaces).
 */
export async function getPortalDashboard(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      studentLoginNumber: true,
      studentPasswordConfigured: true,
    },
  })
  if (!user) return null

  const application = await prisma.admissionApplication.findFirst({
    where: { applicantUserId: user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      status: true,
      studentNumber: true,
      submittedAt: true,
      admissionProgram: { select: { code: true, name: true } },
      admissionIntake: { select: { label: true, year: true } },
    },
  })

  const degree = await prisma.studentDegreeEnrollment.findUnique({
    where: { userId: user.id },
    include: {
      admissionProgram: { select: { code: true, name: true } },
    },
  })

  return {
    user,
    summary: {
      degreeProgram: degree?.admissionProgram?.name ?? null,
      degreeCode: degree?.admissionProgram?.code ?? null,
    },
    application,
  }
}
