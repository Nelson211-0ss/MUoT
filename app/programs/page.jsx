import Link from 'next/link'
import { Award, Briefcase, Layers } from 'lucide-react'

import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import ProgramCard from '@/components/ProgramCard'
import MediaIntroPanel from '@/components/marketing/MediaIntroPanel'
import StatGrid from '@/components/marketing/StatGrid'

const PROGRAM_STATS = [
  { label: 'Pathways', value: '6', hint: 'Undergraduate ICT' },
  { label: 'Format', value: 'Hybrid', hint: 'Online-first delivery' },
  { label: 'Projects', value: 'Labs', hint: 'Portfolio-based' },
]

export default function Programs() {
  return (
    <PageLayout
      title="Programs"
      subtitle="Explore our in-demand IT programmes and start your journey today."
    >
      <MediaIntroPanel
        title="Pathways built for the digital economy"
        description="From software engineering to cybersecurity and cloud — each programme blends theory, hands-on labs, and portfolio work aligned with industry expectations."
        badgeSub="Academics · Programmes"
      >
        <Link
          href="/admissions/apply"
          className="inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-primary hover:brightness-95"
        >
          Apply now
        </Link>
      </MediaIntroPanel>

      <section className="mt-14 md:mt-16">
        <StatGrid items={PROGRAM_STATS} columns={3} />
      </section>

      <section className="mt-14 md:mt-16">
        <SectionHeader
          eyebrow="Catalogue"
          title="All academic programmes"
          subtitle="Choose a pathway aligned with your career goals in technology."
          align="left"
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
          <ProgramCard variant="catalog" title="Software Engineering" desc="Full-stack development and modern programming practices." />
          <ProgramCard variant="catalog" title="Cybersecurity" desc="Ethical hacking, network security, and threat protection." />
          <ProgramCard variant="catalog" title="AI & Data Science" desc="Machine learning, analytics, and intelligent systems." />
          <ProgramCard variant="catalog" title="Networking" desc="Computer networks, infrastructure, and system administration." />
          <ProgramCard variant="catalog" title="Cloud Computing" desc="AWS, Azure, and scalable cloud-native applications." />
          <ProgramCard variant="catalog" title="Data Science" desc="Data analysis, visualization, and AI-powered insights." />
        </div>
      </section>

      <section className="mt-14 md:mt-16">
        <SectionHeader
          eyebrow="Why MUT"
          align="left"
          title="Built for career outcomes"
          subtitle="Structured pathways, real projects, and financial support when you qualify."
        />
        <div className="grid gap-4 md:grid-cols-3">
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Layers className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
          <div>
            <p className="font-bold text-primary">Modular curriculum</p>
            <p className="mt-1 text-sm text-slate-600">Stack credentials across semesters with clear prerequisites.</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Briefcase className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
          <div>
            <p className="font-bold text-primary">Industry projects</p>
            <p className="mt-1 text-sm text-slate-600">Graduate with a portfolio employers can evaluate.</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Award className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
          <div>
            <p className="font-bold text-primary">Scholarships</p>
            <p className="mt-1 text-sm text-slate-600">
              <Link href="/admissions/scholarships" className="font-semibold text-primary hover:underline">
                Explore awards
              </Link>{' '}
              after you apply.
            </p>
          </div>
        </div>
        </div>
      </section>
    </PageLayout>
  )
}
