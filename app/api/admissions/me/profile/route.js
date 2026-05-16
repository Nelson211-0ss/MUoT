import { NextResponse } from 'next/server'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { getApplicantOrError } from '@/lib/applicantAuth'

const schema = z.object({
  name: z.string().trim().min(2).max(160),
})

export async function PATCH(request) {
  const { response, user } = await getApplicantOrError()
  if (response) return response
  const body = schema.safeParse(await request.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid name.' }, { status: 400 })

  await prisma.user.update({
    where: { id: user.id },
    data: { name: body.data.name },
  })

  return NextResponse.json({ ok: true })
}
