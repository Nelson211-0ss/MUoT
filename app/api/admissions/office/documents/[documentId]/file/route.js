import { readFile } from 'node:fs/promises'

import prisma from '@/lib/prisma'

import { forbidUnlessAny, getAdmissionOfficeCtx } from '@/lib/admissions/office-guard'
import { resolveAdmissionAbsolutePath } from '@/lib/admissions/document-storage'
import { P } from '@/lib/rbac/constants'

const PERMS = [
  P.ADMISSIONS_PIPELINE_VIEW,
  P.ADMISSIONS_VIEW,
  P.ADMISSIONS_MANAGE,
  P.ADMISSIONS_APPLICATION_REVIEW,
  P.ADMISSIONS_DOCUMENTS_VERIFY,
]

export async function GET(_request, { params }) {
  const documentId = String((await params).documentId ?? '')

  const { response, permissionKeys } = await getAdmissionOfficeCtx()
  if (response) return response
  const gate = forbidUnlessAny(permissionKeys, PERMS)
  if (gate) return gate

  const doc = await prisma.admissionDocument.findUnique({ where: { id: documentId } })
  if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

  let abs
  try {
    abs = resolveAdmissionAbsolutePath(doc.storedPath)
  } catch {
    return Response.json({ error: 'Forbidden' }, { status: 400 })
  }

  try {
    const buffer = await readFile(abs)
    const ext = doc.fileName.split('.').pop()?.toLowerCase()
    let ct = doc.mimeType || 'application/octet-stream'
    if (ext === 'pdf') ct = 'application/pdf'
    const headers = new Headers()
    headers.set('Content-Type', ct)
    headers.set(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(doc.fileName ?? 'upload')}"`,
    )
    return new Response(buffer, { status: 200, headers })
  } catch {
    return Response.json({ error: 'Missing file' }, { status: 404 })
  }
}
