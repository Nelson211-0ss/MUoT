import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getLecturerOrError } from '@/lib/lecturerAuth'
import { deleteStoredMaterialFile } from '@/lib/course-material-storage'

export async function DELETE(_request, ctx) {
  const { response, lecturer } = await getLecturerOrError()
  if (response) return response

  try {
    const { id } = await ctx.params

    const row = await prisma.courseMaterial.findUnique({
      where: { id },
      include: { course: { select: { lecturerId: true } } },
    })
    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (row.course.lecturerId !== lecturer.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.courseMaterial.delete({ where: { id } })
    await deleteStoredMaterialFile(row.storedPath)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
