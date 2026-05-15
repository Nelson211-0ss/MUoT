import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import InfoCard from '@/components/InfoCard'
import { Target, Eye, Lightbulb, Users } from 'lucide-react'

export default function About() {
  return (
    <PageLayout
      title="About Us"
      subtitle="Magwi University of Technology is an online-first institution shaping Africa's digital future."
    >
      <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mb-12">
        We are dedicated to digital skills, innovation, cybersecurity, artificial intelligence, and software
        engineering — empowering students to learn anywhere and lead everywhere.
      </p>

      <SectionHeader
        title="Our Mission & Values"
        subtitle="What drives us to deliver world-class online IT education."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
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
    </PageLayout>
  )
}
