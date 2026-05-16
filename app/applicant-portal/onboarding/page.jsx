'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function ApplicantOnboardingPage() {
  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/admissions/me/application')
      const data = await res.json()
      if (res.ok && data.application?.status === 'ENROLLED') {
        await fetch('/api/admissions/me/onboarding', { method: 'PATCH' })
      }
    })()
  }, [])

  return (
    <div className="max-w-xl space-y-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
      <p>Your dossier is complete. Sign out and sign back in so your session upgrades to STUDENT SSO when the registrar has promoted your account.</p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Download your admissions letter preview if available.</li>
        <li>Clear finance holds under Payments.</li>
        <li>Need help? Reach the Admissions desk through your usual MUoT contacts.</li>
      </ol>
      <Link
        href="/student-portal"
        prefetch={false}
        className="inline-flex rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-secondary dark:text-primary"
      >
        Open student portal (after signing in as student)
      </Link>
      <p className="text-xs text-slate-500">Use <strong>Sign out</strong> in the sidebar if your role has changed.</p>
    </div>
  )
}
