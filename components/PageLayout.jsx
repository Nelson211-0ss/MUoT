import Navbar from '@/components/Navbar'
import PageBanner from '@/components/PageBanner'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'

export default function PageLayout({
  title,
  subtitle,
  children,
  showCta = true,
  showFooter = true,
}) {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <PageBanner title={title} subtitle={subtitle} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">{children}</div>
      {showCta && <CTASection />}
      {showFooter && <Footer />}
    </main>
  )
}
