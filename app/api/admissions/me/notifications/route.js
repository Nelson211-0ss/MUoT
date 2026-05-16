import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'

export async function GET() {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const rows = await prisma.admissionInAppNotification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 80,
  })
  const notifications = rows.map((n) => ({
    ...n,
    meta: safeJson(n.meta),
    createdAt: n.createdAt.toISOString(),
    readAt: n.readAt?.toISOString() ?? null,
  }))
  const unreadCount = notifications.filter((n) => !n.readAt).length
  return NextResponse.json({ notifications, unreadCount })
}

function safeJson(s) {
  try {
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}

/** Mark one or many read */
export async function PATCH(request) {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const body = await request.json()
  const ids = Array.isArray(body.ids) ? body.ids.map(String).filter(Boolean) : []
  if (!ids.length) {
    return NextResponse.json({ error: 'Specify notification ids.' }, { status: 400 })
  }
  const now = new Date()
  const res = await prisma.admissionInAppNotification.updateMany({
    where: { userId: user.id, id: { in: ids }, readAt: null },
    data: { readAt: now },
  })
  return NextResponse.json({ ok: true, updated: res.count })
}
