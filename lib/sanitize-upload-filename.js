import path from 'node:path'

/** Shared filename sanitizer for document uploads (admissions, etc.). */
export function sanitizeUploadedFileName(originalName) {
  const base = path.basename(originalName || 'file').replace(/\0/g, '')
  return base.replace(/[^\w.\-()+ ]+/g, '_').slice(0, 180) || 'file'
}
