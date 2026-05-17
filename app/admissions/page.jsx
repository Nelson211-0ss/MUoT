import Link from 'next/link'
import {
  ClipboardList,
  FileText,
  GraduationCap,
  ShieldCheck,
  Wallet,
  Award,
  CircleHelp,
} from 'lucide-react'

import AdmissionsPageLayout from '@/components/admissions/public/AdmissionsPageLayout'
import AdmissionsMediaPanel from '@/components/admissions/public/AdmissionsMediaPanel'
import AdmissionsProcessSteps from '@/components/admissions/public/AdmissionsProcessSteps'
import AdmissionsStatGrid from '@/components/admissions/public/AdmissionsStatGrid'
import AdmissionsFeatureCard from '@/components/admissions/public/AdmissionsFeatureCard'
import AdmissionsCtaBand from '@/components/admissions/public/AdmissionsCtaBand'
import SectionHeader from '@/components/SectionHeader'
import { ADMISSIONS_PROCESS, ADMISSIONS_STATS } from '@/lib/admissions/public-pages'

const QUICK_LINKS = [
  {
    href: '/admissions/requirements',
    title: 'Entry requirements',
    description: 'Transcripts, ID, referees, and language readiness for ICT programmes.',
    icon: ClipboardList,
    cta: 'View checklist',
  },
  {
    href: '/admissions/tuition',
    title: 'Tuition & fees',
    description: 'Acceptance levies, payment rails, and finance verification steps.',
    icon: Wallet,
    cta: 'See fee guide',
  },
  {
    href: '/admissions/scholarships',
    title: 'Scholarships',
    description: 'Merit, women-in-STEM, and community access bands after dossier review.',
    icon: Award,
    cta: 'Explore awards',
  },
  {
    href: '/admissions/faqs',
    title: 'FAQs',
    description: 'Timelines, transfers, payments, and how to use the applicant portal.',
    icon: CircleHelp,
    cta: 'Read answers',
  },
]

export default function AdmissionsHubPage() {
  return (
    <AdmissionsPageLayout
      title="Admissions"
      subtitle="Digital-first undergraduate onboarding — register, submit your dossier, and track decisions in one secure portal."
    >
      <AdmissionsMediaPanel
        title="Your path from applicant to enrolled learner"
        description="Magwi University of Technology runs a concierge-grade admissions cloud: SSO-native accounts, document vault integrity, and registrar automation when you are ready to join campus."
      >
        <Link
          href="/admissions/apply"
          className="inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-primary hover:brightness-95"
        >
          Start application
        </Link>
      </AdmissionsMediaPanel>

      <section className="mt-14 md:mt-16">
        <SectionHeader
          eyebrow="Process"
          align="left"
          title="How admissions works"
          subtitle="Four clear stages from registration through registrar enrollment."
        />
        <AdmissionsProcessSteps steps={ADMISSIONS_PROCESS} />
      </section>

      <section className="mt-14 md:mt-16">
        <AdmissionsStatGrid items={ADMISSIONS_STATS} />
      </section>

      <section className="mt-14 md:mt-16">
        <SectionHeader eyebrow="Resources" align="left" title="Explore the desk" subtitle="Everything you need before you apply." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((card) => (
            <AdmissionsFeatureCard key={card.href} {...card} />
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3 md:mt-16">
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <GraduationCap className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} />
          <div>
            <p className="font-bold text-primary">Programme-led intake</p>
            <p className="mt-1 text-sm text-slate-600">Choose faculty, degree, and cohort in the wizard.</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FileText className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} />
          <div>
            <p className="font-bold text-primary">Secure uploads</p>
            <p className="mt-1 text-sm text-slate-600">MIME-hardened document vault with officer verification.</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldCheck className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} />
          <div>
            <p className="font-bold text-primary">RBAC admissions desk</p>
            <p className="mt-1 text-sm text-slate-600">Officers review, admit, and enroll with full audit trails.</p>
          </div>
        </div>
      </section>

      <section className="mt-14 md:mt-16">
        <AdmissionsCtaBand />
      </section>

      <p className="mt-10 text-center text-sm text-slate-500">
        Admissions desk:{' '}
        <a href="mailto:admissions@mut.edu" className="font-semibold text-primary hover:underline">
          admissions@mut.edu
        </a>
      </p>
    </AdmissionsPageLayout>
  )
}
