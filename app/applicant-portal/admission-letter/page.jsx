'use client'

import { useEffect, useState } from 'react'

import PageLayout from '@/components/PageLayout'
import ApplicantPortalShell from '@/components/applicant-portal/ApplicantPortalShell'

export default function AdmissionLetterPreview() {
  const [app, setApp] = useState(null)
  useEffect(() => {
    fetch('/api/admissions/me/application').then(async (res) => {
      const js = await res.json()
      if (res.ok) setApp(js.application)
    })
  }, [])

  const allowed = ['AWAITING_PAYMENT', 'ENROLLED'].includes(app?.status ?? '')
  const studentNo = app?.studentNumber ?? 'Pending registrar issuance'

  return (
    <PageLayout title="Admission letter" subtitle="Council-template preview — print-ready." showBanner={false} showCta={false}>
      <ApplicantPortalShell>
        {!app ? (
          <p className="text-sm text-gray-500">Fetching records…</p>
        ) : !allowed ? (
          <p className="text-sm text-gray-600">
            Visible after provisional approvals. Present status:&nbsp;<strong>{app.status}</strong>
          </p>
        ) : (
          <div className="print:p-16 border border-gray-100 dark:border-white/10 rounded-3xl shadow-inner bg-white dark:bg-white text-primary p-8 space-y-4">
            <header className="flex items-center justify-between border-b border-secondary/70 pb-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-[0.3em] text-secondary">Magwi University of Technology</p>
                <h1 className="text-2xl font-black">Provisional letter of acceptance</h1>
              </div>
              <p className="text-xs font-mono">{new Date().toLocaleDateString()}</p>
            </header>

            <p className="text-sm leading-loose font-serif">
              Dear&nbsp;<strong>{app.fullName}</strong>,
              <br />
              <br />
              The Admissions Council is pleased to offer you a provisional place in the&nbsp;
              <strong>{app.program?.name ?? 'selected programme'}</strong> commencing{' '}
              <strong>{app.intake?.label ?? 'forthcoming cohort'}</strong>. Your tentative student dossier references{' '}
              <strong>{studentNo}</strong>.
            </p>

            <ul className="text-sm grid gap-2 list-disc ml-6">
              <li>Acceptance levy instructions appear under Payments · Finance verification unlocks Registrar final IDs.</li>
              <li>Bring original credentials for onboarding · ICT issues SSO within 72h.</li>
            </ul>

            <p className="text-sm italic text-gray-600">Signed digitally · Office of Admissions</p>

            <button
              type="button"
              onClick={() => window.print()}
              className="print:hidden rounded-xl bg-secondary text-primary px-5 py-2 text-sm font-bold"
            >
              Print / PDF
            </button>
          </div>
        )}
      </ApplicantPortalShell>
    </PageLayout>
  )
}
