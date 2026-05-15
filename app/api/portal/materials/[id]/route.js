import fs from 'node:fs/promises'
import prisma from '@/lib/prisma'
import { resolveMaterialAbsolutePath } from '@/lib/course-material-storage'
import { getStudentOrError } from '@/lib/studentAuth'

export async function GET(_request, ctx) {
  const { response, student } = await getStudentOrError()
  if (response) return response

  try {
    const { id } = await ctx.params

    const material = await prisma.courseMaterial.findUnique({
      where: { id },
      select: {
        id: true,
        courseId: true,
        fileName: true,
        storedPath: true,
        mimeType: true,
      },
    })
    if (!material) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const enrolled = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: material.courseId,
        },
      },
    })
    if (!enrolled) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const abs = resolveMaterialAbsolutePath(material.storedPath)
    const buf = await fs.readFile(abs)
    const disposition = `attachment; filename="${encodeURIComponent(material.fileName)}"; filename*=UTF-8''${encodeURIComponent(material.fileName)}`

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': material.mimeType || 'application/octet-stream',
        'Content-Disposition': disposition,
      },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Download failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
