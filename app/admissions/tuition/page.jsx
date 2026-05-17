import { Banknote, CreditCard, Shield } from 'lucide-react'

import AdmissionsPageLayout from '@/components/admissions/public/AdmissionsPageLayout'
import AdmissionsMediaPanel from '@/components/admissions/public/AdmissionsMediaPanel'
import AdmissionsCtaBand from '@/components/admissions/public/AdmissionsCtaBand'
import SectionHeader from '@/components/SectionHeader'
import { TUITION_ITEMS } from '@/lib/admissions/public-pages'

const TUITION_ICONS = [Banknote, CreditCard, Shield]

export default function TuitionPage() {
  return (
    <AdmissionsPageLayout
      title="Tuition & fees"
      subtitle="Acceptance levies and payment verification for provisional cohort placement."
      showCta={false}
    >
      <AdmissionsMediaPanel
        title="Transparent fees before enrollment"
        description="Reference amounts are quoted in SSP. After a provisional admit, you initiate payment in the applicant portal; Finance verifies funds before the registrar issues your learner number."
      />

      <section className="mt-14 md:mt-16">
        <SectionHeader
          eyebrow="Fees"
          align="left"
          title="Fee structure"
          subtitle="Council may update amounts — always confirm in your portal."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {TUITION_ITEMS.map((item, i) => {
            const Icon = TUITION_ICONS[i] ?? Banknote
            return (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="mt-4 text-2xl font-bold text-primary">{item.amount}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-secondary/40 bg-secondary/10 p-6 text-sm text-slate-700">
        <p className="font-semibold text-primary">Need a waiver?</p>
        <p className="mt-2 leading-relaxed">
          Registrars may record offline receipts or authorised waivers during enrollment — contact the admissions desk if you
          were instructed to pay through a partner bank.
        </p>
      </section>

      <section className="mt-14">
        <AdmissionsCtaBand
          title="Provisional admit received?"
          description="Sign in to pay or upload proof of payment in the applicant portal."
          primaryLabel="Go to payments"
          primaryHref="/login?intent=applicant&next=/applicant-portal/payments"
        />
      </section>
    </AdmissionsPageLayout>
  )
}
