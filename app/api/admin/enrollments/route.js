import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getAdminOrError } from '@/lib/adminAuth'
import { syncProgressForNewEnrollment, removeProgressForUnenrollment } from '@/lib/enrollmentAssignments'

const enrollSchema = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1),
})

export async function POST(request) {
  const { response } = await getAdminOrError()
  if (response) return response

  try {
    const body = await request.json()
    const parsed = enrollSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const { userId, courseId } = parsed.data

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Invalid student account' }, { status: 400 })
    }

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId },
      update: {},
    })
    await syncProgressForNewEnrollment(userId, courseId)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Enrollment failed' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { response } = await getAdminOrError()
  if (response) return response

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')
    if (!userId || !courseId) {
      return NextResponse.json({ error: 'userId and courseId required' }, { status: 400 })
    }

    await removeProgressForUnenrollment(userId, courseId)
    await prisma.enrollment.deleteMany({ where: { userId, courseId } })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Could not drop enrollment' }, { status: 500 })
  }
}
