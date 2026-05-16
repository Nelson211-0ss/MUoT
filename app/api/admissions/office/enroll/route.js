import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

import { getAdmissionOfficeCtx } from '@/lib/admissions/office-guard'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { enrollApplicantAsStudent } from '@/lib/admissions/lifecycle'
import { isSystemAdministratorRole } from '@/lib/adminAuth'
import { P } from '@/lib/rbac/constants'

function mayFinalizeEnrollment(permissionKeys) {
  return permissionKeys.includes(P.ADMISSIONS_REGISTRAR_FINALIZE)
}

export async function POST(request) {
  const { response, admin, permissionKeys } = await getAdmissionOfficeCtx()
  if (response) return response
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const canFinalize =
    isSystemAdministratorRole(admin.role) || mayFinalizeEnrollment(permissionKeys)
  if (!canFinalize) {
    return NextResponse.json(
      {
        error: 'You need registrar enrollment rights (or System Administrator role) to issue learner numbers.',
      },
      { status: 403 },
    )
  }

  const body = await request.json().catch(() => ({}))
  const applicationId = String(body.applicationId ?? '')
  const waiveAdmissionFee = Boolean(body.waiveAdmissionFee)
  if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 })

  const row = await prisma.admissionApplication.findUnique({ where: { id: applicationId } })
  if (!row || row.status !== ADMISSION_STATUS.AWAITING_PAYMENT) {
    return NextResponse.json({ error: 'Application not ready for registrar enrollment.' }, { status: 400 })
  }

  try {
    const outcome = await enrollApplicantAsStudent(applicationId, admin.id, { waiveAdmissionFee })
    return NextResponse.json(outcome)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Enrollment failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
