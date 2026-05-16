import prisma from '@/lib/prisma'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { hashPassword } from '@/lib/auth'
import { issueUniqueStudentLoginNumber } from '@/lib/student-credentials'

export async function notifyApplicant(userId, title, body, meta = null) {
  await prisma.admissionInAppNotification.create({
    data: {
      userId,
      title,
      body,
      meta: meta ? JSON.stringify(meta) : null,
    },
  })
}

export async function appendTimeline(applicationId, eventType, payload = null, actorUserId = null) {
  await prisma.admissionTimelineEvent.create({
    data: {
      applicationId,
      eventType,
      payload: payload ? JSON.stringify(payload) : null,
      actorUserId,
    },
  })
}

/**
 * Verified admission fee → issue student number & convert JWT role on next login.
 * @param {string} applicationId
 * @param {string} [actorUserId]
 */
export async function enrollApplicantAsStudent(applicationId, actorUserId = null) {
  const app = await prisma.admissionApplication.findUnique({
    where: { id: applicationId },
    include: {
      admissionIntake: true,
      admissionProgram: true,
      applicant: { select: { id: true, email: true, name: true } },
    },
  })
  if (!app) throw new Error('Application not found')
  if (app.status !== ADMISSION_STATUS.AWAITING_PAYMENT) {
    throw new Error('Application must be awaiting payment')
  }

  const paid = await prisma.admissionFeePayment.findFirst({
    where: { applicationId, status: 'VERIFIED' },
  })
  if (!paid) throw new Error('Admission fee must be verified before enrollment')

  const studentLoginNumber = await issueUniqueStudentLoginNumber()
  const initialPasswordHash = await hashPassword(studentLoginNumber)

  const studentRole = await prisma.role.findUnique({ where: { slug: 'STUDENT' } })
  const applicantRole = await prisma.role.findUnique({ where: { slug: 'APPLICANT' } })
  if (!studentRole || !applicantRole) throw new Error('RBAC roles missing')

  await prisma.$transaction(async (tx) => {
    await tx.admissionApplication.update({
      where: { id: applicationId },
      data: {
        status: ADMISSION_STATUS.ENROLLED,
        studentNumber: studentLoginNumber,
        registrarFinalizedAt: new Date(),
      },
    })
    await tx.userRole.deleteMany({
      where: { userId: app.applicantUserId, roleId: applicantRole.id },
    })
    await tx.userRole.upsert({
      where: { userId_roleId: { userId: app.applicantUserId, roleId: studentRole.id } },
      create: { userId: app.applicantUserId, roleId: studentRole.id },
      update: {},
    })
    await tx.user.update({
      where: { id: app.applicantUserId },
      data: {
        role: 'STUDENT',
        name: app.fullName ?? app.applicant.name,
        studentLoginNumber,
        passwordHash: initialPasswordHash,
        studentPasswordConfigured: false,
      },
    })
    if (app.programId) {
      await tx.studentDegreeEnrollment.upsert({
        where: { userId: app.applicantUserId },
        create: {
          userId: app.applicantUserId,
          admissionProgramId: app.programId,
        },
        update: {
          admissionProgramId: app.programId,
        },
      })
    }

    await tx.admissionTimelineEvent.create({
      data: {
        applicationId,
        eventType: 'ENROLLED_AS_STUDENT',
        actorUserId,
        payload: JSON.stringify({ studentLoginNumber }),
      },
    })
  })

  await notifyApplicant(
    app.applicantUserId,
    'Welcome — you are enrolled',
    `Your 10-digit student login is ${studentLoginNumber}. Use it as BOTH your username and password on first login, then create a permanent password.`,
    { studentLoginNumber },
  )

  return { studentLoginNumber }
}
