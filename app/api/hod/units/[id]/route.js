import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getHodSessionOrError } from '@/lib/hodAuth'
import { P } from '@/lib/rbac/constants'

export async function DELETE(_, { params }) {
  const id = String((await params).id ?? '').trim()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { response } = await getHodSessionOrError({ permission: P.HOD_UNITS_MANAGE })
  if (response) return response

  try {
    await prisma.programCourseUnit.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unable to delete unit (it may already have grades recorded).' }, { status: 400 })
  }
}
