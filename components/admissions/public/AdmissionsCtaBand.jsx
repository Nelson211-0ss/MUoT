import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/** @param {{ title?: string; description?: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string }} props */
export default function AdmissionsCtaBand({
  title = 'Ready to begin?',
  description = 'Create your applicant account and start the online dossier in minutes.',
  primaryHref = '/admissions/apply',
  primaryLabel = 'Apply now',
  secondaryHref = '/login?intent=applicant',
  secondaryLabel = 'Sign in to applicant portal',
}) {
  return (
    <section className="rounded-2xl border border-primary/20 bg-primary px-6 py-10 text-white sm:px-10 sm:py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
          <span className="text-secondary">.</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">{description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-primary sm:w-auto"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
