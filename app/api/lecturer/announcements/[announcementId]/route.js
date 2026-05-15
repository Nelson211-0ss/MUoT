import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getLecturerOrError } from '@/lib/lecturerAuth'

export async function DELETE(_request, ctx) {
  const { response, lecturer } = await getLecturerOrError()
  if (response) return response

  try {
    const { announcementId } = await ctx.params
    const ann = await prisma.announcement.findUnique({
      where: { id: announcementId },
      include: { course: { select: { lecturerId: true } } },
    })
    if (!ann || ann.course.lecturerId !== lecturer.id) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 })
    }
    await prisma.announcement.delete({ where: { id: announcementId } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
