import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'

export const ROLES = {
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER',
  ADMIN: 'ADMIN',
}

export async function getAdminOrError() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), admin: null }
  }
  const admin = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!admin) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), admin: null }
  }
  if (admin.role !== ROLES.ADMIN) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), admin: null }
  }
  return { response: null, admin }
}
