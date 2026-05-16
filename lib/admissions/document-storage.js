import path from 'node:path'
import fs from 'node:fs/promises'
import { sanitizeUploadedFileName } from '@/lib/sanitize-upload-filename'

export const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'admission-uploads')

/** @returns {Promise<string>} relative stored path inside STORAGE_ROOT */
export async function saveAdmissionFile(applicationId, originalName, buffer) {
  const dir = path.join(STORAGE_ROOT, applicationId)
  await fs.mkdir(dir, { recursive: true })
  const safe = sanitizeUploadedFileName(originalName)
  const unique = `${Date.now()}_${safe}`
  const relative = path.join(applicationId, unique).split(path.sep).join('/')
  const abs = path.join(STORAGE_ROOT, relative)
  if (!abs.startsWith(STORAGE_ROOT)) throw new Error('Invalid storage path')
  await fs.writeFile(abs, buffer)
  return relative
}

export function resolveAdmissionAbsolutePath(storedPath) {
  const abs = path.join(STORAGE_ROOT, storedPath)
  if (!abs.startsWith(STORAGE_ROOT)) throw new Error('Invalid path')
  return abs
}
