import Link from 'next/link'
import { Target, Eye, Lightbulb, Users } from 'lucide-react'

import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import InfoCard from '@/components/InfoCard'
import MediaIntroPanel from '@/components/marketing/MediaIntroPanel'
import StatGrid from '@/components/marketing/StatGrid'

const ABOUT_STATS = [
  { label: 'Programmes', value: '6+', hint: 'ICT pathways' },
  { label: 'Delivery', value: 'Online', hint: 'Learn anywhere' },
  { label: 'Focus', value: 'Africa', hint: 'Regional impact' },
  { label: 'Founded', value: 'MUT', hint: 'Magwi · South Sudan' },
]

export default function About() {
  return (
    <PageLayout
      title="About Us"
      subtitle="Magwi University of Technology is an online-first institution shaping Africa's digital future."
    >
      <MediaIntroPanel
        title="Building Africa's digital workforce"
        description="We deliver rigorous, accessible technology education — software, security, data, and cloud — so learners can advance their careers without putting life on hold."
        badgeSub="About · Jonglei"
      >
        <Link
          href="/programs"
          className="inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-primary hover:brightness-95"
        >
          Explore programmes
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-xl border-2 border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Contact us
        </Link>
      </MediaIntroPanel>

      <section className="mt-14 md:mt-16">
        <StatGrid items={ABOUT_STATS} />
      </section>

      <section className="mt-14 md:mt-16">
        <SectionHeader
          eyebrow="Our foundation"
          title="Mission & values"
          subtitle="What drives us to deliver world-class online IT education."
          align="left"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <InfoCard
            icon={Target}
            title="Our Mission"
            desc="Provide accessible, industry-relevant technology education to students across Africa and beyond."
          />
          <InfoCard
            icon={Eye}
            title="Our Vision"
            desc="Become a leading online university for digital innovation and workforce development."
          />
          <InfoCard
            icon={Lightbulb}
            title="Innovation"
            desc="Foster creativity through modern curricula, labs, and real-world project-based learning."
          />
          <InfoCard
            icon={Users}
            title="Community"
            desc="Build a supportive network of learners, instructors, and industry partners."
          />
        </div>
      </section>
    </PageLayout>
  )
}
