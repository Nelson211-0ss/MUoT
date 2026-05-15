import path from 'node:path'
import fs from 'node:fs/promises'

export const SUBMISSIONS_ROOT = path.join(process.cwd(), 'storage', 'assignment-submissions')

export function sanitizeFileName(originalName) {
  const base = path.basename(originalName || 'file').replace(/\0/g, '')
  return base.replace(/[^\w.\-()+ ]+/g, '_').slice(0, 180) || 'file'
}

export async function saveSubmissionFile(assignmentId, userId, uniqueSlug, buffer) {
  const dir = path.join(SUBMISSIONS_ROOT, assignmentId, userId)
  await fs.mkdir(dir, { recursive: true })
  const relative = `${assignmentId}/${userId}/${uniqueSlug}`
  const abs = path.join(SUBMISSIONS_ROOT, relative)
  if (!abs.startsWith(SUBMISSIONS_ROOT)) {
    throw new Error('Invalid path')
  }
  await fs.writeFile(abs, buffer)
  return relative
}

export function resolveSubmissionAbsolutePath(storedPath) {
  const abs = path.join(SUBMISSIONS_ROOT, storedPath)
  if (!abs.startsWith(SUBMISSIONS_ROOT)) {
    throw new Error('Invalid path')
  }
  return abs
}

export async function deleteSubmissionFile(storedPath) {
  if (!storedPath) return
  try {
    const abs = resolveSubmissionAbsolutePath(storedPath)
    await fs.unlink(abs)
  } catch {
    // ignore
  }
}
