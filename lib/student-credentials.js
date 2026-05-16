import crypto from 'node:crypto'

import prisma from '@/lib/prisma'

/** @returns {string} — exactly 10 decimal digits without leading-digit bias. */
function randomTenDigits() {
  const n = crypto.randomInt(0, 10_000_000_000)
  return String(n).padStart(10, '0')
}

/** Issue a collision-safe 10-digit student login id stored on `User.studentLoginNumber`. */
export async function issueUniqueStudentLoginNumber() {
  for (let i = 0; i < 40; i += 1) {
    const candidate = randomTenDigits()
    const clash = await prisma.user.findUnique({ where: { studentLoginNumber: candidate }, select: { id: true } })
    if (!clash) {
      return candidate
    }
  }
  throw new Error('Unable to allocate a unique 10-digit student login id.')
}
