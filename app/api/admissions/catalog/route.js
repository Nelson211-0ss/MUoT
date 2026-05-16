import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [faculties, intakes] = await Promise.all([
      prisma.admissionFaculty.findMany({
        orderBy: { name: 'asc' },
        include: {
          programs: { orderBy: { name: 'asc' }, select: { id: true, name: true, code: true, slug: true } },
        },
      }),
      prisma.admissionIntake.findMany({
        where: { isOpen: true },
        orderBy: { year: 'desc' },
      }),
    ])
    return NextResponse.json({ faculties, intakes })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Catalog unavailable' }, { status: 500 })
  }
}
