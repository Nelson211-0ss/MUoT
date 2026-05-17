import Link from 'next/link'
import { Suspense } from 'react'

import LoginForm from '@/components/LoginForm'
import Logo from '@/components/Logo'

function FormFallback() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex min-h-[22rem] w-full max-w-[440px] items-center justify-center rounded-2xl border border-white/10 bg-white p-10 shadow-2xl"
    >
      <span className="text-sm text-slate-500">Loading sign-in…</span>
    </div>
  )
}

export default function LoginPage() {
  const year = new Date().getFullYear()

  return (
    <main className="min-h-dvh bg-primary text-white">
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <aside
          className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:w-[min(42%,28rem)] lg:flex-col lg:justify-between lg:p-10 xl:p-14"
          aria-hidden
        >
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('/images/students.png')" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-primary/85" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-90">
              <Logo className="h-11 w-11 shrink-0" />
              <div>
                <p className="text-sm font-bold leading-tight tracking-tight">Magwi University of Technology</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-secondary">MUoT portal</p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Secure access</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-balance xl:text-4xl">
              Sign in to your campus desk
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Students, applicants, lecturers, heads of department, and management staff use one trusted entry point for
              admissions, records, and teaching tools.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/45">© {year} Magwi University of Technology</p>
        </aside>

        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 lg:py-12">
          <div className="mb-8 flex flex-col items-center gap-3 text-center lg:hidden">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <Logo className="h-12 w-12" />
              <span className="text-sm font-bold tracking-tight">Magwi University of Technology</span>
            </Link>
            <p className="max-w-xs text-xs text-white/65">Use your institutional credentials to continue.</p>
          </div>

          <Suspense fallback={<FormFallback />}>
            <LoginForm />
          </Suspense>

          <Link
            href="/"
            className="mt-8 text-sm font-medium text-white/60 transition-colors hover:text-secondary"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </main>
  )
}
