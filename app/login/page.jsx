import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import LoginForm from '@/components/LoginForm'

function FormFallback() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="w-full max-w-[420px] rounded-2xl border border-gray-200/90 bg-white p-10 shadow-sm min-h-[12rem] flex items-center justify-center text-sm text-gray-500"
    >
      Loading…
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50/90">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <Suspense fallback={<FormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
