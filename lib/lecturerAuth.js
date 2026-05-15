import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'

export async function getLecturerOrError() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), lecturer: null }
  }
  const lecturer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!lecturer) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), lecturer: null }
  }
  if (lecturer.role !== 'LECTURER') {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), lecturer: null }
  }
  return { response: null, lecturer }
}
