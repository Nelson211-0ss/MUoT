import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'

/**
 * Student-facing APIs use DB role — JWT may be stale if roles change.
 */
export async function getStudentOrError() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), student: null }
  }

  const student = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!student) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), student: null }
  }
  const roleNorm = (student.role ?? '').trim().toUpperCase()
  if (roleNorm !== 'STUDENT') {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), student: null }
  }

  return { response: null, student }
}
