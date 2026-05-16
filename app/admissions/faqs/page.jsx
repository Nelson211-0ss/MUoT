import PageLayout from '@/components/PageLayout'

const qa = [
  {
    q: 'How quickly are decisions communicated?',
    a: 'Officers aim for a two-week SLA after submission completeness; SLA expands if documents uplift is requested.',
  },
  {
    q: 'Do you accept transferees mid-intake?',
    a: 'Select programmes allow limited lateral entry — desk reviews academic parity before issuing provisional letters.',
  },
  {
    q: 'Which payment integrations are shipping?',
    a: 'This build stubs Stripe · Flutterwave · MTN Momo · Airtel rails with finance verifying against ledger rows.',
  },
]

export default function AdmissionFaqsPage() {
  return (
    <PageLayout title="Admissions FAQs" subtitle="Straight answers grounded in registrar policy." showCta={false}>
      <dl className="space-y-6">
        {qa.map(({ q, a }) => (
          <div key={q}>
            <dt className="font-bold text-primary text-lg">{q}</dt>
            <dd className="mt-2 text-sm text-gray-700 leading-relaxed">{a}</dd>
          </div>
        ))}
      </dl>
    </PageLayout>
  )
}
