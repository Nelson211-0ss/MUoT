import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'
import { resolveApplicantWorkbench } from '@/lib/admissions/active-application'
import { ADMISSION_STATUS, ALLOWED_MIME, DOC_TYPES, MAX_UPLOAD_BYTES } from '@/lib/admissions/constants'
import { saveAdmissionFile } from '@/lib/admissions/document-storage'
import { appendTimeline } from '@/lib/admissions/lifecycle'

function allowUpload(status) {
  return status === ADMISSION_STATUS.DRAFT || status === ADMISSION_STATUS.AWAITING_DOCUMENTS
}

/** @returns {Promise<File|null>} */
function getFile(record) {
  if (record instanceof File && record.size > 0) return record
  return null
}

export async function POST(request) {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const wb = await resolveApplicantWorkbench(user.id)
  if (wb.mode !== 'edit') {
    return NextResponse.json({ error: 'Portal is locked for your current admissions state.' }, { status: 400 })
  }
  if (!allowUpload(wb.application.status)) {
    return NextResponse.json(
      {
        error: 'Document uploads reopen when Admissions requests additional paperwork.',
      },
      { status: 400 },
    )
  }

  const formData = await request.formData()
  const docType = String(formData.get('docType') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim() || `${docType} upload`
  const file = getFile(formData.get('file'))
  const allowedDocs = new Set(Object.values(DOC_TYPES))
  if (!allowedDocs.has(docType)) {
    return NextResponse.json({ error: 'Unsupported document category.' }, { status: 400 })
  }
  if (!file) {
    return NextResponse.json({ error: 'Attach a PDF or image file.' }, { status: 400 })
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'File exceeds upload limit.' }, { status: 400 })
  }
  const mime = file.type?.toLowerCase() ?? ''
  if (!ALLOWED_MIME.has(mime)) {
    return NextResponse.json({ error: 'Unsupported file type (PDF/JPG/PNG only).' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const stored = await saveAdmissionFile(wb.application.id, file.name, buffer)

  const row = await prisma.admissionDocument.create({
    data: {
      applicationId: wb.application.id,
      docType,
      title,
      fileName: file.name,
      storedPath: stored,
      mimeType: mime,
      sizeBytes: buffer.length,
    },
  })

  await appendTimeline(wb.application.id, 'DOCUMENT_UPLOADED', {
    docType,
    docId: row.id,
    actorUserId: user.id,
  })

  return NextResponse.json({ ok: true, document: row })
}
