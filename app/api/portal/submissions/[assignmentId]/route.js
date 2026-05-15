import fs from 'node:fs/promises'
import prisma from '@/lib/prisma'
import { resolveSubmissionAbsolutePath } from '@/lib/assignment-submission-storage'
import { getStudentOrError } from '@/lib/studentAuth'

export async function GET(_request, ctx) {
  const { response, student } = await getStudentOrError()
  if (response) return response

  try {
    const { assignmentId } = await ctx.params

    const progress = await prisma.assignmentProgress.findUnique({
      where: {
        userId_assignmentId: { userId: student.id, assignmentId },
      },
      select: {
        submissionStoredPath: true,
        submissionFileName: true,
        status: true,
        grade: true,
      },
    })
    if (!progress?.submissionStoredPath) {
      return new Response(JSON.stringify({ error: 'No submission' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
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
    return new Response(JSON.stringify({ error: 'Download failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
