import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(5000),
})

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check your message.', details: parsed.error.flatten() }, { status: 400 })
    }

    const msg = await prisma.contactMessage.create({
      data: parsed.data,
    })

    return NextResponse.json({
      ok: true,
      id: msg.id,
      message: 'Thank you. We will respond soon.',
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Could not send message' }, { status: 500 })
  }
}
