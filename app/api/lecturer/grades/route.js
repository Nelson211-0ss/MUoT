import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getLecturerOrError } from '@/lib/lecturerAuth'

const bodySchema = z.object({
  progressId: z.string().min(1),
  grade: z.number().int().min(0),
  feedback: z.string().max(4000).optional().nullable(),
})

export async function PATCH(request) {
  const { response, lecturer } = await getLecturerOrError()
  if (response) return response

  try {
    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const { progressId, grade, feedback } = parsed.data

    const progress = await prisma.assignmentProgress.findUnique({
      where: { id: progressId },
      include: {
        assignment: true,
      },
    })
    if (!progress) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const course = await prisma.course.findFirst({
      where: { id: progress.assignment.courseId, lecturerId: lecturer.id },
    })
    if (!course) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const maxPoints = progress.assignment.maxPoints ?? 100
    if (grade > maxPoints) {
      return NextResponse.json({ error: `Grade cannot exceed ${maxPoints} points` }, { status: 400 })
    }

    await prisma.assignmentProgress.update({
      where: { id: progressId },
      data: {
        grade,
        feedback: feedback ?? '',
        status: 'GRADED',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Could not save grade' }, { status: 500 })
  }
}
