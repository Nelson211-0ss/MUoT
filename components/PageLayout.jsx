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
              ? 'mx-auto w-full min-w-0 max-w-[1400px] flex-1 px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:px-10'
              : 'mx-auto w-full min-w-0 max-w-[1400px] flex-1 px-4 pt-8 pb-10 sm:px-6 sm:pb-12 md:pb-16 lg:px-10'
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
