import Link from 'next/link'
import { FileCheck, IdCard, Languages } from 'lucide-react'

import AdmissionsPageLayout from '@/components/admissions/public/AdmissionsPageLayout'
import AdmissionsMediaPanel from '@/components/admissions/public/AdmissionsMediaPanel'
import AdmissionsCtaBand from '@/components/admissions/public/AdmissionsCtaBand'
import SectionHeader from '@/components/SectionHeader'
import { REQUIREMENTS_GROUPS } from '@/lib/admissions/public-pages'

const GROUP_ICONS = {
  'Academic credentials': FileCheck,
  'Identity & references': IdCard,
  'Language readiness': Languages,
}

export default function AdmissionRequirementsPage() {
  return (
    <AdmissionsPageLayout
      title="Admission requirements"
      subtitle="Credential and identity expectations for undergraduate ICT programmes."
      showCta={false}
    >
      <AdmissionsMediaPanel
        reverse
        title="Prepare your dossier before you apply"
        description="Upload certified PDFs through the applicant portal. Admissions officers verify authenticity before provisional decisions are recorded."
      >
        <Link
          href="/admissions/apply"
          className="inline-flex rounded-xl border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Open application wizard
        </Link>
      </AdmissionsMediaPanel>

      <section className="mt-14 md:mt-16">
        <SectionHeader
          align="left"
          title="Readiness checklist"
          subtitle="Group your documents early — incomplete files delay desk review."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {REQUIREMENTS_GROUPS.map((group) => {
            const Icon = GROUP_ICONS[group.title] ?? FileCheck
            return (
              <article key={group.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">{group.title}</h3>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-14">
        <AdmissionsCtaBand
          title="Documents ready?"
          description="Register once, then upload everything in the guided wizard."
          secondaryHref="/admissions/faqs"
          secondaryLabel="Read FAQs"
        />
      </section>
    </AdmissionsPageLayout>
  )
}
