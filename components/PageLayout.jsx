import Navbar from '@/components/Navbar'
import PageBanner from '@/components/PageBanner'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { AnimateRouteShell } from '@/components/PageMotion'

export default function PageLayout({
  title,
  subtitle,
  children,
  /** Hero / banner under the navbar (omit on logged-in dashboards). */
  showBanner = true,
  showCta = true,
  showFooter = true,
}) {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <AnimateRouteShell className="flex flex-col flex-1 min-h-0 w-full">
        {showBanner ? <PageBanner title={title} subtitle={subtitle} /> : null}
        <div
          className={
            showBanner
              ? 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 flex-1 w-full'
              : 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-12 md:pb-16 flex-1 w-full'
          }
        >
          {children}
        </div>
        {showCta ? <CTASection /> : null}
        {showFooter ? <Footer /> : null}
      </AnimateRouteShell>
    </main>
  )
}
