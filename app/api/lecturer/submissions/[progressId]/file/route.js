import fs from 'node:fs/promises'
import prisma from '@/lib/prisma'
import { getLecturerOrError } from '@/lib/lecturerAuth'
import { resolveSubmissionAbsolutePath } from '@/lib/assignment-submission-storage'

export async function GET(_request, ctx) {
  const { response, lecturer } = await getLecturerOrError()
  if (response) return response

  try {
    const { progressId } = await ctx.params

    const progress = await prisma.assignmentProgress.findUnique({
      where: { id: progressId },
      include: {
        assignment: {
          select: { courseId: true },
        },
      },
    })
    if (!progress?.submissionStoredPath) {
      return new Response(JSON.stringify({ error: 'No submission file' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const course = await prisma.course.findFirst({
      where: { id: progress.assignment.courseId, lecturerId: lecturer.id },
    })
    if (!course) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const abs = resolveSubmissionAbsolutePath(progress.submissionStoredPath)
    const buf = await fs.readFile(abs)
    const name = progress.submissionFileName || 'submission'
    const disposition = `attachment; filename="${encodeURIComponent(name)}"; filename*=UTF-8''${encodeURIComponent(name)}`

    return new Response(buf, {
      headers: {
        'Content-Type': 'application/octet-stream',
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
