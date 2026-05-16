import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'

import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'
import { resolveApplicantWorkbench } from '@/lib/admissions/active-application'
import { resolveAdmissionAbsolutePath } from '@/lib/admissions/document-storage'

export async function GET(_request, { params }) {
  const { documentId } = await params

  const { response, user } = await getApplicantOrError()
  if (response) return response
  const wb = await resolveApplicantWorkbench(user.id)

  const doc = await prisma.admissionDocument.findFirst({
    where: { id: documentId },
  })

  if (!doc || doc.applicationId !== wb.application.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let absolute
  try {
    absolute = resolveAdmissionAbsolutePath(doc.storedPath)
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 400 })
  }

  let buffer
  try {
    buffer = await readFile(absolute)
  } catch {
    return NextResponse.json({ error: 'File missing on server' }, { status: 404 })
  }

  const ext = doc.fileName.split('.').pop()?.toLowerCase()
  let contentType = doc.mimeType || 'application/octet-stream'
  if (ext === 'pdf') contentType = 'application/pdf'

  const headers = new Headers()
  headers.set('Content-Type', contentType)
  headers.set(
    'Content-Disposition',
    `inline; filename="${encodeURIComponent(doc.fileName ?? 'upload')}"`,
  )

  return new Response(buffer, {
    headers,
    status: 200,
  })
}
