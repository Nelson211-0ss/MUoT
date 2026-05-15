import { NextResponse } from 'next/server'
import { getPortalDashboard } from '@/lib/portal'
import { getStudentOrError } from '@/lib/studentAuth'

export async function GET() {
  const { response, student } = await getStudentOrError()
  if (response) return response

  const data = await getPortalDashboard(student.id)
  if (!data) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(data)
}
