import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getPortalDashboard } from '@/lib/portal'

export async function GET() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await getPortalDashboard(session.userId)
  if (!data) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(data)
}
