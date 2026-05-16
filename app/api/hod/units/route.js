import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getHodSessionOrError } from '@/lib/hodAuth'
import { P } from '@/lib/rbac/constants'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const admissionProgramId = String(searchParams.get('admissionProgramId') ?? '').trim()
  if (!admissionProgramId) return NextResponse.json({ error: 'admissionProgramId required' }, { status: 400 })

  const { response } = await getHodSessionOrError({ permission: P.HOD_UNITS_MANAGE })
  if (response) return response

  const units = await prisma.programCourseUnit.findMany({
    where: { admissionProgramId },
    orderBy: { unitCode: 'asc' },
  })

  return NextResponse.json({ units })
}

const createSchema = z.object({
  admissionProgramId: z.string().min(1),
  unitCode: z.string().trim().min(2).max(32),
  title: z.string().trim().min(2).max(200),
  creditHours: z.coerce.number().int().min(1).max(30).optional().default(3),
})

export async function POST(request) {
  const { response } = await getHodSessionOrError({ permission: P.HOD_UNITS_MANAGE })
  if (response) return response

  const json = await request.json().catch(() => ({}))
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Provide admissionProgramId, unitCode, title, and optional creditHours.' }, { status: 400 })
  }

  const { admissionProgramId, unitCode, title, creditHours } = parsed.data

  const prog = await prisma.admissionProgram.findUnique({ where: { id: admissionProgramId }, select: { id: true } })
  if (!prog) return NextResponse.json({ error: 'Program not found' }, { status: 404 })

  try {
    const unit = await prisma.programCourseUnit.create({
      data: {
        admissionProgramId,
        unitCode: unitCode.trim().toUpperCase(),
        title: title.trim(),
        creditHours: creditHours ?? 3,
      },
    })
    return NextResponse.json({ unit })
  } catch (e) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'A unit with this code already exists for the program.' }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ error: 'Unable to create unit.' }, { status: 500 })
  }
}
