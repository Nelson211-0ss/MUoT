'use client'

import { useEffect, useState } from 'react'

export default function StudentFeesPanel() {
  const [payload, setPayload] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/student/fees')
      .then(async (r) => ({ ok: r.ok, data: await r.json().catch(() => ({})) }))
      .then(({ ok, data }) => {
        if (cancelled) return
        if (!ok) {
          setErr(data?.error ?? 'Unable to load fees.')
          return
        }
        setPayload(data)
      })
      .catch(() => cancelled || setErr('Network error.'))
    return () => {
      cancelled = true
    }
  }, [])

  function fmtMinor(minor, currency) {
    const v = (minor ?? 0) / 100
    return `${currency ?? 'SSP'} ${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (err) {
    return <p className="text-sm font-semibold text-red-700">{err}</p>
  }
  if (!payload) return <p className="text-sm text-gray-500">Loading statutory assessments…</p>

  const assessments = payload.assessments ?? []
  const outstandingMinor = payload.outstandingMinor ?? 0

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Outstanding balance snapshot</p>
        <p className="mt-2 text-2xl font-black text-emerald-900">{fmtMinor(outstandingMinor, assessments[0]?.currency)}</p>
        <p className="text-xs text-emerald-800 mt-2">Outstanding rows only; settled charges stay listed for archival reference.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">Charge</th>
              <th className="p-3">Period</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assessments.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  Finance has not lined up tuition lines yet — check back after onboarding.
                </td>
              </tr>
            ) : (
              assessments.map((a) => (
                <tr key={a.id}>
                  <td className="p-3 font-semibold text-gray-900">{a.label}</td>
                  <td className="p-3 text-gray-600">
                    {a.academicYear} · semester {a.semesterNumber}
                  </td>
                  <td className="p-3 font-mono">{fmtMinor(a.amountMinor, a.currency)}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-bold uppercase ${
                        a.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : a.status === 'OUTSTANDING' || a.status === 'OVERDUE'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
