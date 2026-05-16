import prisma from '@/lib/prisma'

/**
 * Persist an immutable audit row.
 * @param {{ userId?: string | null, action: string, resource: string, meta?: unknown, request?: Request }} input
 */
export async function writeAuditLog({ userId, action, resource, meta, request }) {
  let ip = null
  let userAgent = null
  if (request) {
    const h = request.headers
    ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('x-real-ip') ?? null
    userAgent = h.get('user-agent') ?? null
  }
  const metaJson = meta === undefined || meta === null ? null : JSON.stringify(meta)

  await prisma.auditLog.create({
    data: {
      userId: userId ?? null,
      action,
      resource,
      meta: metaJson,
      ip,
      userAgent,
    },
  })
}
