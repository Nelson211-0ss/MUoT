import { randomUUID } from 'node:crypto'
import prisma from '@/lib/prisma'
import { getStudentOrError } from '@/lib/studentAuth'
import {
  sanitizeFileName,
  saveSubmissionFile,
  deleteSubmissionFile,
} from '@/lib/assignment-submission-storage'

const MAX_BYTES = 15 * 1024 * 1024

export async function POST(request, ctx) {
  const { response, student } = await getStudentOrError()
  if (response) return response

  try {
    const { assignmentId } = await ctx.params

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { id: true, courseId: true, dueDate: true },
    })
    if (!assignment) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    const enrolled = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: student.id, courseId: assignment.courseId },
      },
    })
    if (!enrolled) {
      return Response.json({ error: 'Not enrolled' }, { status: 403 })
    }

    let progress = await prisma.assignmentProgress.findUnique({
      where: {
        userId_assignmentId: { userId: student.id, assignmentId },
      },
    })
    if (!progress) {
      progress = await prisma.assignmentProgress.create({
        data: { userId: student.id, assignmentId, status: 'PENDING' },
      })
    }
    if (progress.grade != null) {
      return Response.json({ error: 'This assignment is already graded and locked.' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ error: 'Attach a file.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: 'File too large (max 15 MB).' }, { status: 400 })
    }

    const safe = sanitizeFileName(file.name)
    const unique = `${randomUUID()}_${safe}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const stored = await saveSubmissionFile(assignmentId, student.id, unique, buffer)

    if (progress.submissionStoredPath) {
      await deleteSubmissionFile(progress.submissionStoredPath)
    }

    const now = new Date()
    const status = now > assignment.dueDate ? 'LATE' : 'SUBMITTED'

    await prisma.assignmentProgress.update({
      where: { id: progress.id },
      data: {
        status,
        submittedAt: now,
        submissionStoredPath: stored,
        submissionFileName: safe,
      },
    })

    return Response.json({ ok: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Submit failed' }, { status: 500 })
  }
}
