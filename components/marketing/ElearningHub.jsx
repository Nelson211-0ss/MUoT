'use client'

import Link from 'next/link'
import {
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  MonitorPlay,
  Shield,
  Users,
} from 'lucide-react'

import FeatureCard from '@/components/marketing/FeatureCard'
import PremiumCtaBand from '@/components/marketing/PremiumCtaBand'
import MediaIntroPanel from '@/components/marketing/MediaIntroPanel'
import SectionHeader from '@/components/SectionHeader'

const CAPABILITIES = [
  {
    icon: MonitorPlay,
    title: 'Live & recorded lessons',
    description: 'Join synchronous sessions or replay lectures on your schedule.',
  },
  {
    icon: ClipboardCheck,
    title: 'Assignments & quizzes',
    description: 'Submit coursework, attempt timed quizzes, and receive rubric feedback.',
  },
  {
    icon: MessageSquare,
    title: 'Forums & collaboration',
    description: 'Discuss modules with peers and instructors in course forums.',
  },
  {
    icon: BookOpen,
    title: 'Resource library',
    description: 'Access readings, slides, and lab packs organised by week.',
  },
  {
    icon: Users,
    title: 'Cohort spaces',
    description: 'Stay aligned with your programme group and teaching assistants.',
  },
  {
    icon: Shield,
    title: 'Secure SSO access',
    description: 'Sign in with university credentials provisioned by ICT.',
  },
]

export default function ElearningHub({ moodleUrl = '' }) {
  const hasUrl = Boolean(moodleUrl)

  return (
    <>
      <MediaIntroPanel
        title="Your digital classroom at MUT"
        description="MUT E-Learning is the institutional Moodle platform for every taught module — lessons, assessments, grades, and collaboration in one place."
        badgeSub="MUT E-Learning · Moodle LMS"
      >
        {hasUrl ? (
          <a
            href={moodleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-primary hover:brightness-95"
          >
            Open MUT E-Learning
          </a>
        ) : (
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border-2 border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Contact ICT Helpdesk
          </Link>
        )}
      </MediaIntroPanel>

      <section className="mt-14 md:mt-16">
        <SectionHeader
          eyebrow="Platform"
          align="left"
          title="Everything you need to learn online"
          subtitle="The MUoT web portal handles identity and governance; day-to-day teaching happens in Moodle."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {!hasUrl ? (
        <p className="mt-8 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-slate-700">
          ICT can enable one-click launch by setting{' '}
          <code className="rounded bg-white px-1 font-mono text-xs">NEXT_PUBLIC_MOODLE_URL</code> in your environment.
        </p>
      ) : null}

      <div className="mt-14 md:mt-16">
        <PremiumCtaBand
          fullBleed={false}
          eyebrow="E-Learning"
          title="Ready to enter your courses?"
          description="Use your university credentials. New students receive Moodle access after registration is confirmed."
          bullets={[
            { icon: BookOpen, text: 'Course materials published by week' },
            { icon: Shield, text: 'Single sign-on with ICT support' },
          ]}
          actions={
            hasUrl
              ? [
                  { href: moodleUrl, label: 'Launch MUT E-Learning', variant: 'primary' },
                  { href: '/student-portal', label: 'Student portal', variant: 'secondary' },
                ]
              : [
                  { href: '/contact', label: 'Contact ICT', variant: 'primary' },
                  { href: '/login', label: 'Sign in to portal', variant: 'secondary' },
                ]
          }
        />
      </div>
    </>
  )
}
