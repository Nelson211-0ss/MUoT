'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import PageLayout from '@/components/PageLayout'
import ApplicantPortalShell from '@/components/applicant-portal/ApplicantPortalShell'

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
    <PageLayout title="Enrollment onboarding" subtitle="Bridge from Applicant SSO into the Student LMS." showCta={false}>
      <ApplicantPortalShell>
        <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-slate-300">
          <p>
            Admissions + Finance synced your dossier · reopen the LMS as a STUDENT after signing out and signing back in so
            the JWT picks up registrar updates.
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Download your admissions letter preview for records.</li>
            <li>Finance clearance moves you from applicant JWT to STUDENT SSO.</li>
            <li>Need help? Contact <span className="font-semibold">admissions@mut.edu</span> (routing stub).</li>
          </ol>
          <Link href="/student-portal" prefetch={false} className="inline-flex px-6 py-2 rounded-xl bg-secondary text-primary font-bold">
            Open Student Portal after signing out/in
          </Link>
          <p className="text-xs text-gray-500">
            Middleware blocks stale cookies — sign out from the Navbar first whenever your role swaps.
          </p>
        </div>
      </ApplicantPortalShell>
    </PageLayout>
  )
}
