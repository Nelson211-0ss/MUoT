import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import { CheckCircle } from 'lucide-react'

const pillars = ['Online dossier wizard', 'Document vault integrity', 'RBAC Admissions HQ', 'Automated SSO promotion']

export default function AdmissionsHubPage() {
  return (
    <PageLayout
      title="Admissions"
      subtitle="Magwi University of Technology admissions cloud — SSO-native, concierge-grade workflows."
      showBanner
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 mb-14">
        <div>
          <SectionHeader title="Momentum to enrollment" subtitle="Digital-first onboarding that mirrors Tier-1 research universities." align="left" />
          <ul className="space-y-4">
            {pillars.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <CheckCircle className="shrink-0 w-5 h-5 text-secondary mt-0.5" />
                <span className="text-gray-700 text-sm leading-relaxed dark:text-slate-300">
                  <span className="font-semibold text-primary dark:text-secondary">Step {i + 1}. </span>
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[32px] border border-secondary/70 bg-white dark:bg-slate-900 p-10 shadow-xl space-y-5">
          <p className="text-sm uppercase font-bold tracking-widest text-primary dark:text-secondary">Begin here</p>
          <div className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-300">
            <p>New applicants provisioning APPLICANT JWT access with secure uploads, OTP-assisted verification, tuition rails, analytics and registrar automation.</p>
            <Link
              href="/login?intent=applicant&next=%2Fapplicant-portal%2Fapplication"
              className="inline-flex w-full justify-center rounded-2xl bg-secondary text-primary font-bold px-8 py-3 hover:brightness-95"
            >
              Start / resume application wizard
            </Link>
            <Link href="/admissions/requirements" className="inline-flex justify-center text-sm font-semibold text-blue-700 dark:text-secondary">
              Explore requirements →
            </Link>
          </div>
        </div>
      </div>

      <SectionHeader align="center" title="Operational transparency" subtitle="Newsroom + analytics integrated with management RBAC consoles." />

      <div className="grid md:grid-cols-4 gap-4 text-center mb-14">
        {[
          ['Office throughput', 'Sub-7d median review SLA'],
          ['Digital vault', 'MIME-hardened storage'],
          ['Finance escrow', 'MTN/Airtel/Stripe stubs'],
          ['Registrar automation', 'MUT/year/code/XXX IDs'],
        ].map(([t, sub]) => (
          <div key={t} className="rounded-2xl border border-gray-100 dark:border-white/10 p-6 bg-gray-50/80 dark:bg-slate-900/60 shadow-sm">
            <p className="font-bold text-primary dark:text-secondary text-sm">{t}</p>
            <p className="text-[11px] text-gray-500 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      <SectionHeader align="left" title="Still exploring?" subtitle="Speak with Admissions concierges anchored in Jonglei innovation corridor." />

      <p className="text-sm text-gray-600 mb-12">
        Direct channels: admissions@mut.edu · +211-000-MUT-STU (routing stub until telco interconnect).
      </p>
    </PageLayout>
  )
}
