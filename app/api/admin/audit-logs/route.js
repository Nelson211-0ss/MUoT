import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getManagementSessionOrError } from '@/lib/adminAuth'
import { P } from '@/lib/rbac/constants'

/** Latest audit trail entries — super/compliance dashboards. */
export async function GET() {
  const { response, permissionKeys } = await getManagementSessionOrError()
  if (response) return response
  if (!permissionKeys.includes(P.AUDIT_VIEW)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 80,
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  })

  return NextResponse.json({
    logs: rows.map((r) => ({
      id: r.id,
      action: r.action,
      resource: r.resource,
      meta: (() => {
        if (!r.meta) return null
        try {
          return JSON.parse(r.meta)
        } catch {
          return null
        }
      })(),
      ip: r.ip,
      createdAt: r.createdAt.toISOString(),
      actor: r.user
        ? {
            email: r.user.email,
            name: r.user.name,
            role: r.user.role,
          }
        : null,
    })),
  })
}
