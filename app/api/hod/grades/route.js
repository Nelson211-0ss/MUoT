import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getHodSessionOrError } from '@/lib/hodAuth'
import { P } from '@/lib/rbac/constants'

const bodySchema = z.object({
  studentLoginNumber: z.string().regex(/^\d{10}$/),
  programCourseUnitId: z.string().min(1),
  academicYear: z.coerce.number().int().min(1990).max(2100),
  semesterNumber: z.coerce.number().int().min(1).max(6),
  scorePercent: z.coerce.number().int().min(0).max(100),
})

export async function POST(request) {
  const { response, hod } = await getHodSessionOrError({ permission: P.HOD_GRADES_RECORD })
  if (response) return response
  if (!hod) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await request.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid grade payload.' }, { status: 400 })
  }

  const { studentLoginNumber, programCourseUnitId, academicYear, semesterNumber, scorePercent } = parsed.data

  const unit = await prisma.programCourseUnit.findUnique({
    where: { id: programCourseUnitId },
    select: { id: true, admissionProgramId: true, unitCode: true },
  })
  if (!unit) return NextResponse.json({ error: 'Course unit not found.' }, { status: 404 })

  const learner = await prisma.user.findUnique({
    where: { studentLoginNumber },
    select: { id: true },
  })
  if (!learner) {
    return NextResponse.json({ error: 'Student number not recognised.' }, { status: 404 })
  }

  const enrollment = await prisma.studentDegreeEnrollment.findUnique({
    where: { userId: learner.id },
    select: { admissionProgramId: true },
  })
  if (!enrollment || enrollment.admissionProgramId !== unit.admissionProgramId) {
    return NextResponse.json(
      { error: 'This learner is not registered on the programme that owns this unit; adjust enrollment first.' },
      { status: 400 },
    )
  }

  const row = await prisma.studentUnitResult.upsert({
    where: {
      userId_programCourseUnitId_academicYear_semesterNumber: {
        userId: learner.id,
        programCourseUnitId,
        academicYear,
        semesterNumber,
      },
    },
    create: {
      userId: learner.id,
      programCourseUnitId,
      academicYear,
      semesterNumber,
      scorePercent,
      recordedByUserId: hod.id,
    },
    update: {
      scorePercent,
      recordedByUserId: hod.id,
    },
  })

  return NextResponse.json({ result: row })
}
