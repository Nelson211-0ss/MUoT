import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturesSection from '@/components/FeaturesSection'
import ProgramCard from '@/components/ProgramCard'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <FeaturesSection />

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 pb-20">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Our Popular Programs</h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Explore our in-demand IT programs and start your journey today.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          <ProgramCard
            variant="home"
            title="Software Development"
            desc="Learn modern web and mobile application development."
          />
          <ProgramCard
            variant="home"
            title="Cybersecurity"
            desc="Protect systems and networks in the digital world."
          />
          <ProgramCard
            variant="home"
            title="Data Science"
            desc="Analyze data and build AI-powered systems."
          />
          <ProgramCard
            variant="home"
            title="Cloud Computing"
            desc="Deploy and manage applications in the cloud."
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
