import path from 'node:path'
import fs from 'node:fs/promises'

export const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'course-materials')

/** @param {string} originalName */
export function sanitizeUploadedFileName(originalName) {
  const base = path.basename(originalName || 'file').replace(/\0/g, '')
  return base.replace(/[^\w.\-()+ ]+/g, '_').slice(0, 180) || 'file'
}

/** @param {string} courseId @param {string} uniqueSlug */
export async function saveCourseMaterialBuffer(courseId, uniqueSlug, buffer) {
  const dir = path.join(STORAGE_ROOT, courseId)
  await fs.mkdir(dir, { recursive: true })
  const relative = `${courseId}/${uniqueSlug}`
  const abs = path.join(STORAGE_ROOT, relative)
  if (!abs.startsWith(STORAGE_ROOT)) {
    throw new Error('Invalid storage path')
  }
  await fs.writeFile(abs, buffer)
  return relative
}

/** @param {string} storedPath relative from STORAGE_ROOT */
export function resolveMaterialAbsolutePath(storedPath) {
  const abs = path.join(STORAGE_ROOT, storedPath)
  if (!abs.startsWith(STORAGE_ROOT)) {
    throw new Error('Invalid path')
  }
  return abs
}

export async function deleteStoredMaterialFile(storedPath) {
  try {
    const abs = resolveMaterialAbsolutePath(storedPath)
    await fs.unlink(abs)
  } catch {
    // ignore missing file
  }
}
