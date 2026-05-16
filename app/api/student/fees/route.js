import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getStudentSessionOrError } from '@/lib/studentSession'

export async function GET() {
  const { response, student } = await getStudentSessionOrError()
  if (response) return response
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const assessments = await prisma.tuitionAssessment.findMany({
    where: { userId: student.id },
    orderBy: [{ academicYear: 'desc' }, { semesterNumber: 'desc' }, { recordedAt: 'desc' }],
  })

  const minorTotals = assessments.reduce((acc, row) => {
    if (row.status === 'OUTSTANDING' || row.status === 'OVERDUE') {
      acc += row.amountMinor
    }
    return acc
  }, 0)

  return NextResponse.json({
    assessments: assessments.map((a) => ({
      id: a.id,
      label: a.label,
      description: a.description,
      amountMinor: a.amountMinor,
      currency: a.currency,
      academicYear: a.academicYear,
      semesterNumber: a.semesterNumber,
      status: a.status,
      recordedAt: a.recordedAt,
      paidAt: a.paidAt,
    })),
    outstandingMinor: minorTotals,
  })
}
