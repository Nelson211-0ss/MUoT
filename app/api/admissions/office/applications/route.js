import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { forbidUnlessAny, getAdmissionOfficeCtx } from '@/lib/admissions/office-guard'
import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { P } from '@/lib/rbac/constants'

const LIST_PERM = [
  P.ADMISSIONS_PIPELINE_VIEW,
  P.ADMISSIONS_VIEW,
  P.ADMISSIONS_MANAGE,
  P.ADMISSIONS_APPLICATION_REVIEW,
  P.ADMISSIONS_ANALYTICS_VIEW,
]

export async function GET(request) {
  const { response, admin, permissionKeys } = await getAdmissionOfficeCtx()
  if (response) return response

  const gate = forbidUnlessAny(permissionKeys, LIST_PERM)
  if (gate) return gate

  const { searchParams } = request.nextUrl
  const status = searchParams.get('status') ?? ''
  const q = searchParams.get('q')?.trim()?.toLowerCase() ?? ''

  const validStatuses = Object.values(ADMISSION_STATUS)
  const normalizedStatus =
    typeof status === 'string' && status && validStatuses.includes(status) ? status : null

  const whereClause = normalizedStatus ? { status: normalizedStatus } : {}

  const rows = await prisma.admissionApplication.findMany({
    where: whereClause,
    include: {
      applicant: { select: { email: true, name: true, id: true } },
      admissionProgram: true,
      admissionIntake: true,
    },
    orderBy: [{ updatedAt: 'desc' }],
    take: 200,
  })

  /** @sqlite */
  const filtered = q.length
    ? rows.filter((r) => `${r.fullName ?? ''} ${r.applicant?.email ?? ''}`.toLowerCase().includes(q))
    : rows

  return NextResponse.json({
    viewer: admin,
    applications: filtered.map((a) => ({
      id: a.id,
      status: a.status,
      applicant: a.applicant,
      program: a.admissionProgram,
      intake: a.admissionIntake,
      studentNumber: a.studentNumber,
      updatedAt: a.updatedAt.toISOString(),
      submittedAt: a.submittedAt?.toISOString() ?? null,
      fullName: a.fullName,
    })),
  })
}
