import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import prisma from '@/lib/prisma'
import { getLecturerOrError } from '@/lib/lecturerAuth'
import { assertLecturerOwnsCourse } from '@/lib/lecturer'
import { sanitizeUploadedFileName, saveCourseMaterialBuffer } from '@/lib/course-material-storage'

const MAX_BYTES = 12 * 1024 * 1024

export async function POST(request) {
  const { response, lecturer } = await getLecturerOrError()
  if (response) return response

  try {
    const formData = await request.formData()
    const courseId = String(formData.get('courseId') ?? '').trim()
    const title = String(formData.get('title') ?? '').trim()
    const file = formData.get('file')

    if (!courseId || !title) {
      return NextResponse.json({ error: 'Course and title are required.' }, { status: 400 })
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Please choose a file to upload.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 12 MB).' }, { status: 400 })
    }

    const course = await assertLecturerOwnsCourse(lecturer.id, courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not found or not assigned to you.' }, { status: 403 })
    }

    const safeName = sanitizeUploadedFileName(file.name)
    const unique = `${randomUUID()}_${safeName}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const storedPath = await saveCourseMaterialBuffer(courseId, unique, buffer)

    await prisma.courseMaterial.create({
      data: {
        courseId,
        title,
        fileName: safeName,
        storedPath,
        mimeType: file.type || null,
        sizeBytes: file.size,
        uploadedById: lecturer.id,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
