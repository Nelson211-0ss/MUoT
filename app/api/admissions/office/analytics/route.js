import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

import { forbidUnlessAny, getAdmissionOfficeCtx } from '@/lib/admissions/office-guard'
import { P } from '@/lib/rbac/constants'

const PERMS = [P.ADMISSIONS_ANALYTICS_VIEW, P.ADMISSIONS_PIPELINE_VIEW]

export async function GET() {
  const { response, permissionKeys } = await getAdmissionOfficeCtx()
  if (response) return response
  const gate = forbidUnlessAny(permissionKeys, PERMS)
  if (gate) return gate

  const totals = await prisma.admissionApplication.groupBy({
    by: ['status'],
    _count: { _all: true },
  })

  const appsWithProg = await prisma.admissionApplication.findMany({
    where: { programId: { not: null } },
    select: { programId: true },
  })
  /** @type {Record<string, number>} */
  const progCount = {}
  for (const a of appsWithProg) {
    const pid = a.programId ?? ''
    if (!pid) continue
    progCount[pid] = (progCount[pid] ?? 0) + 1
  }

  const programIds = Object.keys(progCount)
  const programs = await prisma.admissionProgram.findMany({
    where: { id: { in: programIds } },
  })
  const nameByProg = Object.fromEntries(programs.map((p) => [p.id, p.name]))

  const revenueAgg = await prisma.admissionFeePayment.aggregate({
    where: { status: 'VERIFIED' },
    _sum: { amountMinor: true },
  })

  const programPopularity = programIds.map((id) => ({
    programId: id,
    programName: nameByProg[id] ?? 'Program',
    count: progCount[id] ?? 0,
  }))
  programPopularity.sort((a, b) => b.count - a.count)

  return NextResponse.json({
    byStatus: totals.map((t) => ({
      status: t.status,
      count: t._count._all,
    })),
    programPopularity,
    verifiedFeeVolumeMinor: revenueAgg._sum.amountMinor ?? 0,
    currencyHint: 'SSP',
  })
}
