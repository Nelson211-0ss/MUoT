import PageLayout from '@/components/PageLayout'

export default function TuitionPage() {
  return (
    <PageLayout title="Tuition • acceptance levies" subtitle="SSP-denominated reference numbers for provisional cohorts." showCta={false}>
      <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
        <p>
          Acceptance registration fees are seeded at <strong>150,000 SSP</strong> instructional units pending council
          updates. Applicants generate payment intents per preferred rail; Finance verifies before registrar finalizes SSO
          role elevation.
        </p>
      </div>
    </PageLayout>
  )
}
