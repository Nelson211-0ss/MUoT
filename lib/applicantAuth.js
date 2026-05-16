import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'

export async function getApplicantOrError() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null }
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, emailVerifiedAt: true },
  })
  if (!user) return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null }
  if ((user.role ?? '').toUpperCase() !== 'APPLICANT') {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), user: null }
  }
  return { response: null, user }
}
