import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(200),
  email: z.string().trim().email(),
  phone: z.string().trim().min(5).max(40),
  program: z.string().trim().min(1).max(120),
})

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = applicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check all fields.', details: parsed.error.flatten() }, { status: 400 })
    }

    const app = await prisma.application.create({
      data: parsed.data,
    })

    return NextResponse.json({
      ok: true,
      id: app.id,
      message: 'Application received. We will contact you by email.',
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Could not submit application' }, { status: 500 })
  }
}
