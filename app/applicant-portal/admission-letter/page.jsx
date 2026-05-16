'use client'

import { useEffect, useState } from 'react'

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
    <div className="max-w-3xl">
      {!app ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : !allowed ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Available after provisional decision. Current status:&nbsp;<strong>{app.status}</strong>
        </p>
      ) : (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-primary shadow-sm print:border-0 print:shadow-none dark:border-white/10 dark:bg-white dark:text-primary">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Magwi University of Technology</p>
              <h2 className="mt-2 text-xl font-bold">Provisional letter of acceptance</h2>
            </div>
            <p className="font-mono text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
          </header>

          <p className="text-sm leading-relaxed">
            Dear <strong>{app.fullName}</strong>,
            <br />
            <br />
            The Admissions Council offers you a provisional place in&nbsp;
            <strong>{app.program?.name ?? 'your selected programme'}</strong>, cohort <strong>{app.intake?.label ?? 'TBA'}</strong>.
            Student reference: <strong>{studentNo}</strong>.
          </p>

          <ul className="list-disc space-y-1 pl-6 text-sm">
            <li>Complete acceptance levy under Payments as instructed.</li>
            <li>Bring original credentials for onboarding.</li>
          </ul>

          <p className="text-sm italic text-slate-600">Office of Admissions</p>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white print:hidden dark:bg-secondary dark:text-primary"
          >
            Print / Save PDF
          </button>
        </div>
      )}
    </div>
  )
}
