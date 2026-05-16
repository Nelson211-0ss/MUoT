import PageLayout from '@/components/PageLayout'
import prisma from '@/lib/prisma'
import HodWorkspaceClient from '@/components/portals/HodWorkspaceClient'

export default async function HodPortalPage() {
  const programs = await prisma.admissionProgram.findMany({
    select: { id: true, code: true, name: true },
    orderBy: { code: 'asc' },
  })

  return (
    <PageLayout
      title="Head of department"
      subtitle="Define programme course units before recording semester marks."
      showBanner={false}
      showCta={false}
      showFooter={false}
    >
      <HodWorkspaceClient programs={programs} />
    </PageLayout>
  )
}
