import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

/**
 * @param {string} email
 * @param {string} purpose
 * @param {number} [ttlMinutes]
 * @returns {Promise<{ expiresAt: Date, plain?: string }>} plain populated in dev/local for smoke tests
 */
export async function issueOtp(email, purpose, ttlMinutes = 20) {
  const normalized = email.trim().toLowerCase()
  const code = String(crypto.randomInt(100000, 999999))

  await prisma.verificationToken.deleteMany({
    where: { email: normalized, purpose },
  })

  const codeHash = await bcrypt.hash(code, 10)
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)
  await prisma.verificationToken.create({
    data: { email: normalized, purpose, codeHash, expiresAt },
  })

  return { expiresAt, plain: process.env.NODE_ENV === 'production' ? undefined : code }
}

/**
 * @param {string} email
 * @param {string} purpose
 * @param {string} code
 */
export async function consumeOtp(email, purpose, code) {
  const normalized = email.trim().toLowerCase()
  const row = await prisma.verificationToken.findFirst({
    where: {
      email: normalized,
      purpose,
      expiresAt: { gt: new Date() },
      consumedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  })
  if (!row) return false
  const ok = await bcrypt.compare(String(code).trim(), row.codeHash)
  if (!ok) return false
  await prisma.verificationToken.update({
    where: { id: row.id },
    data: { consumedAt: new Date() },
  })
  return true
}
