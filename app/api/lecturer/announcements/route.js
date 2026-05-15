import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getLecturerOrError } from '@/lib/lecturerAuth'
import { assertLecturerOwnsCourse } from '@/lib/lecturer'

const schema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(2).max(200),
  body: z.string().trim().min(1).max(8000),
})

export async function POST(request) {
  const { response, lecturer } = await getLecturerOrError()
  if (response) return response

  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const { courseId, title, body } = parsed.data

    const course = await assertLecturerOwnsCourse(lecturer.id, courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not yours' }, { status: 403 })
    }

    const ann = await prisma.announcement.create({
      data: { courseId, authorId: lecturer.id, title, body },
      select: { id: true, title: true, body: true, createdAt: true },
    })

    return NextResponse.json({ ok: true, announcement: ann })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to post announcement' }, { status: 500 })
  }
}
