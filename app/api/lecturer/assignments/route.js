import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getLecturerOrError } from '@/lib/lecturerAuth'
import { assertLecturerOwnsCourse } from '@/lib/lecturer'
import { syncProgressForNewAssignment } from '@/lib/enrollmentAssignments'

const schema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(2).max(200),
  description: z.string().max(8000).optional().nullable(),
  maxPoints: z.number().int().min(1).max(500).optional(),
  dueDate: z.string().datetime(),
})

export async function POST(request) {
  const { response, lecturer } = await getLecturerOrError()
  if (response) return response

  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }
    const { courseId, title, description, maxPoints, dueDate } = parsed.data

    const owned = await assertLecturerOwnsCourse(lecturer.id, courseId)
    if (!owned) {
      return NextResponse.json({ error: 'Course not yours' }, { status: 403 })
    }

    const due = new Date(dueDate)
    if (Number.isNaN(due.getTime())) {
      return NextResponse.json({ error: 'Invalid due date' }, { status: 400 })
    }

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title,
        description: description || null,
        maxPoints: maxPoints ?? 100,
        dueDate: due,
      },
    })

    await syncProgressForNewAssignment(courseId, assignment.id)

    return NextResponse.json({ ok: true, assignment: { id: assignment.id } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Could not create assignment' }, { status: 500 })
  }
}
