import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturesSection from '@/components/FeaturesSection'
import ProgramCard from '@/components/ProgramCard'
import Footer from '@/components/Footer'
import { HomeSpotlightSection, HomeCtaSection } from '@/components/HomePageSections'
import { homeProgramCovers } from '@/lib/siteImages'
import { FlyInMount, RevealFlyIn } from '@/components/PageMotion'

export default function Home() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <FlyInMount className="flex flex-col flex-1 min-h-0 w-full">
        <Hero />
      </FlyInMount>
      <RevealFlyIn className="w-full">
        <FeaturesSection />
      </RevealFlyIn>
      <RevealFlyIn delay={0.06} className="w-full">
        <HomeSpotlightSection />
      </RevealFlyIn>

      <RevealFlyIn delay={0.06} className="w-full">
        <section className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-20 pb-16 md:pb-24 flex-1">
          <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Programs</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Popular pathways</h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
              From code to cloud, pick a concentration that matches your goals—each track blends theory, labs, and
              portfolio work.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-7 items-stretch">
            <ProgramCard
              variant="home"
              title="Software Development"
              desc="Learn modern web and mobile application development with hands-on projects."
              coverImage={homeProgramCovers.software}
              coverAlt="Laptop with code on screen representing software development"
            />
            <ProgramCard
              variant="home"
              title="Cybersecurity"
              desc="Protect systems and networks with ethical security practices and defensive tooling."
              coverImage={homeProgramCovers.cybersecurity}
              coverAlt="Network security and digital protection concept"
            />
            <ProgramCard
              variant="home"
              title="Data Science"
              desc="Analyze data, communicate insights, and build models that support real decisions."
              coverImage={homeProgramCovers.dataScience}
              coverAlt="Data analytics and charts on a display"
            />
            <ProgramCard
              variant="home"
              title="Cloud Computing"
              desc="Deploy and manage resilient applications on leading cloud platforms."
              coverImage={homeProgramCovers.cloud}
              coverAlt="Cloud technology and global infrastructure visualization"
            />
          </div>
        </section>
      </RevealFlyIn>

      <RevealFlyIn delay={0.06} className="w-full">
        <HomeCtaSection />
      </RevealFlyIn>
      <Footer />
    </main>
  )
}
