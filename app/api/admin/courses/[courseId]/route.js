import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getAdminOrError } from '@/lib/adminAuth'

const patchSchema = z.object({
  lecturerId: z.union([z.string().min(1), z.literal(''), z.null()]).optional(),
})

/** @param {Request} req @param {{ params: Promise<{ courseId: string }> }} ctx */
export async function PATCH(req, ctx) {
  const { response } = await getAdminOrError()
  if (response) return response

  try {
    const { courseId } = await ctx.params
    const body = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    let lecturerId =
      parsed.data.lecturerId === '' || parsed.data.lecturerId === null ? null : parsed.data.lecturerId
    if (lecturerId) {
      const lec = await prisma.user.findFirst({
        where: { id: lecturerId, role: 'LECTURER' },
      })
      if (!lec) {
        return NextResponse.json({ error: 'Invalid lecturer id' }, { status: 400 })
      }
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { lecturerId },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
