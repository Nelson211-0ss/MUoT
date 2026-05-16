import prisma from '@/lib/prisma'
import HodPortalShell from '@/components/portals/HodPortalShell'

export default async function HodPortalPage() {
  const programs = await prisma.admissionProgram.findMany({
    select: { id: true, code: true, name: true },
    orderBy: { code: 'asc' },
  })

  return <HodPortalShell programs={programs} />
}
