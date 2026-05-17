import { Award, Sparkles, Users } from 'lucide-react'

import AdmissionsPageLayout from '@/components/admissions/public/AdmissionsPageLayout'
import AdmissionsMediaPanel from '@/components/admissions/public/AdmissionsMediaPanel'
import AdmissionsCtaBand from '@/components/admissions/public/AdmissionsCtaBand'
import SectionHeader from '@/components/SectionHeader'
import { SCHOLARSHIP_BANDS } from '@/lib/admissions/public-pages'

const BAND_ICONS = [Award, Users, Sparkles]

export default function ScholarshipPage() {
  return (
    <AdmissionsPageLayout
      title="Scholarships"
      subtitle="Inclusive excellence and strategic ICT diversification at Magwi."
      showCta={false}
    >
      <AdmissionsMediaPanel
        reverse
        title="Funding pathways after dossier review"
        description="Scholarship bands are assessed once your application is complete. Awards are confirmed after provisional enrollment and finance clearance — expressions of interest lodge automatically with your file."
      />

      <section className="mt-14 md:mt-16">
        <SectionHeader
          align="left"
          title="Award bands"
          subtitle="Eligibility combines merit, equity goals, and programme strategic priorities."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {SCHOLARSHIP_BANDS.map((band, i) => {
            const Icon = BAND_ICONS[i] ?? Award
            return (
              <article key={band.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">{band.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{band.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-14">
        <AdmissionsCtaBand
          title="Complete your dossier first"
          description="Scholarship consideration starts with a submitted application — register and finish the wizard."
          secondaryHref="/admissions/requirements"
          secondaryLabel="View requirements"
        />
      </section>
    </AdmissionsPageLayout>
  )
}
