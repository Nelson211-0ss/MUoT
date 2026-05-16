import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

import { forbidUnlessAny, getAdmissionOfficeCtx } from '@/lib/admissions/office-guard'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { enrollApplicantAsStudent } from '@/lib/admissions/lifecycle'
import { P } from '@/lib/rbac/constants'

const PERMS = [P.ADMISSIONS_REGISTRAR_FINALIZE, P.ADMISSIONS_MANAGE]

export async function POST(request) {
  const { response, permissionKeys, admin } = await getAdmissionOfficeCtx()
  if (response) return response
  const gate = forbidUnlessAny(permissionKeys, PERMS)
  if (gate) return gate

  const body = await request.json().catch(() => ({}))
  const applicationId = String(body.applicationId ?? '')
  if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 })

  const row = await prisma.admissionApplication.findUnique({ where: { id: applicationId } })
  if (!row || row.status !== ADMISSION_STATUS.AWAITING_PAYMENT) {
    return NextResponse.json({ error: 'Application not ready for registrar enrollment.' }, { status: 400 })
  }

  try {
    const outcome = await enrollApplicantAsStudent(applicationId, admin?.id ?? null)
    return NextResponse.json(outcome)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Enrollment failed'
    const code = message.includes('must be awaiting') ? 400 : 400
    return NextResponse.json({ error: message }, { status: code })
  }
}
