import PageLayout from '@/components/PageLayout'

import AdmissionsSubnav from '@/components/admissions/public/AdmissionsSubnav'

/** Public admissions pages — banner + section nav + content. */
export default function AdmissionsPageLayout({
  title,
  subtitle,
  children,
  showCta = true,
  showFooter = true,
}) {
  return (
    <PageLayout title={title} subtitle={subtitle} showCta={showCta} showFooter={showFooter}>
      <AdmissionsSubnav />
      {children}
    </PageLayout>
  )
}
