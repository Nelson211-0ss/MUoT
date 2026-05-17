import AdmissionsPageLayout from '@/components/admissions/public/AdmissionsPageLayout'
import AdmissionsMediaPanel from '@/components/admissions/public/AdmissionsMediaPanel'
import AdmissionsFaqList from '@/components/admissions/public/AdmissionsFaqList'
import AdmissionsCtaBand from '@/components/admissions/public/AdmissionsCtaBand'
import SectionHeader from '@/components/SectionHeader'
import { ADMISSIONS_FAQS } from '@/lib/admissions/public-pages'

export default function AdmissionFaqsPage() {
  return (
    <AdmissionsPageLayout title="Admissions FAQs" subtitle="Straight answers grounded in registrar policy." showCta={false}>
      <AdmissionsMediaPanel
        reverse
        title="Answers before you submit"
        description="Policies for timelines, transfers, payments, and portal access — expand any question below or sign in for file-specific updates."
        badgeSub="Admissions · Help"
      />

      <section className="mt-14 md:mt-16">
        <SectionHeader
          eyebrow="Help desk"
          align="left"
          title="Common questions"
          subtitle="Tap a question to expand. For file-specific updates, sign in to the applicant portal."
        />
        <AdmissionsFaqList items={ADMISSIONS_FAQS} />
      </section>

      <section className="mt-14 md:mt-16">
        <AdmissionsCtaBand secondaryHref="/admissions/status" secondaryLabel="Track application status" />
      </section>
    </AdmissionsPageLayout>
  )
}
