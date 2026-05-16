import prisma from '@/lib/prisma'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'

const INCLUDE = {
  admissionFaculty: true,
  admissionProgram: true,
  admissionIntake: true,
  documents: { orderBy: { createdAt: 'desc' } },
  timeline: { orderBy: { createdAt: 'asc' }, take: 120 },
  comments: {
    where: { visibility: 'APPLICANT' },
    orderBy: { createdAt: 'desc' },
    take: 40,
  },
  payments: { orderBy: { createdAt: 'desc' } },
}

/** Latest rejected application used for immutable history + reapply CTA */
export async function getLatestRejectedApplication(applicantUserId) {
  return prisma.admissionApplication.findFirst({
    where: { applicantUserId, status: ADMISSION_STATUS.REJECTED },
    orderBy: { updatedAt: 'desc' },
    include: INCLUDE,
  })
}

/**
 * Prefer any non-terminal application; excludes REJECTED from the active drafting path.
 */
export async function resolveApplicantWorkbench(applicantUserId) {
  const activePipeline = await prisma.admissionApplication.findFirst({
    where: {
      applicantUserId,
      status: {
        notIn: [ADMISSION_STATUS.REJECTED],
      },
    },
    orderBy: { updatedAt: 'desc' },
    include: INCLUDE,
  })

  if (activePipeline) {
    const frozen =
      activePipeline.status === ADMISSION_STATUS.ENROLLED ||
      activePipeline.status === ADMISSION_STATUS.AWAITING_PAYMENT
    return { mode: frozen ? 'view' : 'edit', application: activePipeline }
  }

  const rejected = await getLatestRejectedApplication(applicantUserId)
  if (rejected) {
    return { mode: 'reapply', application: rejected }
  }

  const created = await prisma.admissionApplication.create({
    data: {
      applicantUserId,
      status: ADMISSION_STATUS.DRAFT,
    },
    include: INCLUDE,
  })

  await prisma.admissionTimelineEvent.create({
    data: {
      applicationId: created.id,
      eventType: 'APPLICATION_OPENED',
    },
  })

  const withTimeline = await prisma.admissionApplication.findUnique({
    where: { id: created.id },
    include: INCLUDE,
  })

  return { mode: 'edit', application: withTimeline ?? created }
}
