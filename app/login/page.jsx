import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import PageBanner from '@/components/PageBanner'
import Footer from '@/components/Footer'
import LoginForm from '@/components/LoginForm'
import { AnimateRouteShell } from '@/components/PageMotion'

function FormFallback() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl p-8 md:p-10 shadow border border-gray-100 h-64 flex items-center justify-center text-gray-500 text-sm">
      Loading…
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <AnimateRouteShell className="flex flex-col flex-1 min-h-0 w-full">
        <PageBanner title="Student Login" subtitle="Access your courses, assignments, and academic records." />

        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 flex justify-center flex-1">
          <Suspense fallback={<FormFallback />}>
            <LoginForm />
          </Suspense>
        </section>

        <Footer />
      </AnimateRouteShell>
    </main>
  )
}
