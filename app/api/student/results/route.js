import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getStudentSessionOrError } from '@/lib/studentSession'
import { buildTranscriptSnapshots } from '@/lib/academic-metrics'

export async function GET() {
  const { response, student } = await getStudentSessionOrError()
  if (response) return response
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await prisma.studentUnitResult.findMany({
    where: { userId: student.id },
    include: {
      programCourseUnit: {
        select: { unitCode: true, title: true, creditHours: true, admissionProgramId: true },
      },
    },
    orderBy: [{ academicYear: 'asc' }, { semesterNumber: 'asc' }],
  })

  const { semesters } = buildTranscriptSnapshots(rows)

  const latestCgpa = semesters.length ? semesters[semesters.length - 1].cumulativeGpa : null

  return NextResponse.json({
    latestCgpa,
    semesters: semesters.map((s) => ({
      academicYear: s.academicYear,
      semesterNumber: s.semesterNumber,
      semesterGpa: s.semesterGpa,
      cumulativeGpa: s.cumulativeGpa,
      units: s.lines.map((line) => ({
        unitCode: line.programCourseUnit.unitCode,
        title: line.programCourseUnit.title,
        credits: line.programCourseUnit.creditHours,
        scorePercent: line.scorePercent,
        letter: line.letter,
        gradePoint: line.gp,
      })),
    })),
  })
}
