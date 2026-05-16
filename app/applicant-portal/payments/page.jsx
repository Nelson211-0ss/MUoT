'use client'

import { useEffect, useState } from 'react'

import PageLayout from '@/components/PageLayout'
import ApplicantPortalShell from '@/components/applicant-portal/ApplicantPortalShell'

const GATEWAYS = [
  { label: 'Simulated cashier', code: 'SIMULATED', note: 'Local smoke test ledger' },
  { label: 'Stripe', code: 'STRIPE', note: 'Sandbox keys via Finance secret store' },
  { label: 'Flutterwave', code: 'FLUTTERWAVE', note: 'African aggregator rail' },
  { label: 'MTN Mobile Money', code: 'MTN_MOMO', note: 'Telco wallets' },
  { label: 'Airtel Money', code: 'AIRTEL_MONEY', note: 'Operator wallet API' },
]

export default function ApplicantPaymentsPage() {
  const [payments, setPayments] = useState([])
  useEffect(() => {
    fetch('/api/admissions/me/payments').then(async (res) => {
      const json = await res.json()
      if (res.ok) setPayments(json.payments ?? [])
    })
  }, [])

  return (
    <PageLayout title="Payments" subtitle="Acceptance fee choreography with finance escrow." showCta={false}>
      <ApplicantPortalShell>
        <div className="space-y-6">
          <div className="rounded-2xl bg-primary text-white dark:bg-secondary/20 dark:border dark:border-secondary/60 p-5">
            <h2 className="text-xl font-bold">Registration levy staging</h2>
            <p className="text-sm mt-2 text-white/80 dark:text-slate-200">
              When Admissions issues a provisional clearance, initiate your preferred payment rail below. Verified funds unlock
              registrar finalization toward your student SSO.
            </p>
          </div>

          <div className="grid gap-3">
            {GATEWAYS.map((g) => (
              <button
                key={g.code}
                type="button"
                className="text-left rounded-2xl border border-gray-100 dark:border-white/10 px-5 py-4 hover:border-secondary transition-colors bg-white dark:bg-slate-900"
                onClick={async () => {
                  await fetch('/api/admissions/me/payments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gateway: g.code }),
                  })
                  window.location.reload()
                }}
              >
                <p className="font-bold text-primary dark:text-secondary">{g.label}</p>
                <p className="text-xs text-gray-500 mt-1">{g.note}</p>
              </button>
            ))}
          </div>

          <div className="border rounded-2xl p-5 bg-white dark:bg-slate-900 dark:border-white/10">
            <h3 className="font-semibold mb-3">Outstanding rows</h3>
            {(payments ?? []).length ? (
              <ul className="text-xs space-y-2">
                {payments.map((p) => (
                  <li key={p.id} className="flex justify-between rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800/70">
                    <span className="font-semibold text-primary">{p.label}</span>
                    <span>
                      {(p.amountMinor / 1000).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 1,
                      })}{' '}
                      {p.currency} · {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No payment rows staged yet · await provisional admissions.</p>
            )}
          </div>
        </div>
      </ApplicantPortalShell>
    </PageLayout>
  )
}
