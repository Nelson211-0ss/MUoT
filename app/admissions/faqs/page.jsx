import AdmissionsPageLayout from '@/components/admissions/public/AdmissionsPageLayout'
import AdmissionsFaqList from '@/components/admissions/public/AdmissionsFaqList'
import AdmissionsCtaBand from '@/components/admissions/public/AdmissionsCtaBand'
import SectionHeader from '@/components/SectionHeader'
import { ADMISSIONS_FAQS } from '@/lib/admissions/public-pages'

export default function AdmissionFaqsPage() {
  return (
    <AdmissionsPageLayout title="Admissions FAQs" subtitle="Straight answers grounded in registrar policy." showCta={false}>
      <SectionHeader
        align="left"
        title="Common questions"
        subtitle="Tap a question to expand. For file-specific updates, sign in to the applicant portal."
      />
      <AdmissionsFaqList items={ADMISSIONS_FAQS} />
      <section className="mt-14">
        <AdmissionsCtaBand secondaryHref="/admissions/status" secondaryLabel="Track application status" />
      </section>
    </AdmissionsPageLayout>
  )
}
