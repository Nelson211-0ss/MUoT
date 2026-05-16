'use client'

import { useEffect, useState } from 'react'

const GATEWAYS = [
  { label: 'Simulated cashier', code: 'SIMULATED', note: 'Local ledger test' },
  { label: 'Stripe', code: 'STRIPE', note: 'Sandbox integration' },
  { label: 'Flutterwave', code: 'FLUTTERWAVE', note: 'Aggregator rail' },
  { label: 'MTN Mobile Money', code: 'MTN_MOMO', note: 'Telco wallet' },
  { label: 'Airtel Money', code: 'AIRTEL_MONEY', note: 'Operator wallet' },
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Acceptance levy</h2>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          After Admissions admits you provisionally, start a payment instruction here. Verified funds unlock registrar finalization.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {GATEWAYS.map((g) => (
          <button
            key={g.code}
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm transition-colors hover:border-slate-300"
            onClick={async () => {
              await fetch('/api/admissions/me/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gateway: g.code }),
              })
              window.location.reload()
            }}
          >
            <p className="font-semibold text-slate-900">{g.label}</p>
            <p className="mt-1 text-xs text-slate-500">{g.note}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Outstanding</h3>
        {(payments ?? []).length ? (
          <ul className="mt-3 space-y-2 text-xs">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2">
                <span className="font-medium text-slate-800">{p.label}</span>
                <span className="tabular-nums text-slate-600">
                  {(p.amountMinor / 1000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}{' '}
                  {p.currency} · {p.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Nothing due yet · await provisional admission.</p>
        )}
      </div>
    </div>
  )
}
