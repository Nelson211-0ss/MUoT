import Link from 'next/link'
import { Bell, ClipboardList, LogIn } from 'lucide-react'

import AdmissionsPageLayout from '@/components/admissions/public/AdmissionsPageLayout'
import AdmissionsMediaPanel from '@/components/admissions/public/AdmissionsMediaPanel'
import AdmissionsCtaBand from '@/components/admissions/public/AdmissionsCtaBand'

const TRACK_STEPS = [
  { icon: LogIn, title: 'Sign in', text: 'Use your applicant email and password from registration.' },
  { icon: ClipboardList, title: 'Open your dashboard', text: 'See programme choice, progress, and missing documents.' },
  { icon: Bell, title: 'Read notifications', text: 'Officer notes, payment requests, and decision updates appear in-app.' },
]

export default function AdmissionStatusLanding() {
  return (
    <AdmissionsPageLayout
      title="Track your application"
      subtitle="Status, timelines, and officer messages live in the applicant portal — not email."
      showCta={false}
    >
      <AdmissionsMediaPanel
        title="Real-time visibility on your dossier"
        description="After submission, Admissions surfaces review stages, document callbacks, and finance checkpoints inside your secure workspace. Sign in anytime to continue or respond."
      >
        <Link
          href="/login?intent=applicant&next=/applicant-portal"
          className="inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-primary"
        >
          Sign in to portal
        </Link>
      </AdmissionsMediaPanel>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {TRACK_STEPS.map((step) => {
          const Icon = step.icon
          return (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-4 font-bold text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.text}</p>
            </article>
          )
        })}
      </section>

      <section className="mt-14">
        <AdmissionsCtaBand
          title="Not registered yet?"
          description="Create your applicant account first, then complete the online dossier."
          primaryHref="/login?intent=applicant&register=1"
          primaryLabel="Register & apply"
          secondaryHref="/admissions/requirements"
          secondaryLabel="View requirements"
        />
      </section>
    </AdmissionsPageLayout>
  )
}
