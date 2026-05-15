import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import ProgramCard from '@/components/ProgramCard'

export default function Programs() {
  return (
    <PageLayout
      title="Programs"
      subtitle="Explore our in-demand IT programs and start your journey today."
    >
      <SectionHeader
        title="All Academic Programs"
        subtitle="Choose a pathway aligned with your career goals in technology."
        align="left"
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        <ProgramCard variant="home" title="Software Engineering" desc="Full-stack development and modern programming practices." />
        <ProgramCard variant="home" title="Cybersecurity" desc="Ethical hacking, network security, and threat protection." />
        <ProgramCard variant="home" title="AI & Data Science" desc="Machine learning, analytics, and intelligent systems." />
        <ProgramCard variant="home" title="Networking" desc="Computer networks, infrastructure, and system administration." />
        <ProgramCard variant="home" title="Cloud Computing" desc="AWS, Azure, and scalable cloud-native applications." />
        <ProgramCard variant="home" title="Data Science" desc="Data analysis, visualization, and AI-powered insights." />
      </div>
    </PageLayout>
  )
}
