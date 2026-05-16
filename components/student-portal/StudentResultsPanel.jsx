'use client'

import { useEffect, useState } from 'react'

export default function StudentResultsPanel() {
  const [payload, setPayload] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/student/results')
      .then(async (r) => ({ ok: r.ok, data: await r.json().catch(() => ({})) }))
      .then(({ ok, data }) => {
        if (cancelled) return
        if (!ok) {
          setErr(data?.error ?? 'Unable to load transcript.')
          return
        }
        setPayload(data)
      })
      .catch(() => cancelled || setErr('Network error.'))
    return () => {
      cancelled = true
    }
  }, [])

  if (err) return <p className="text-sm font-semibold text-red-700">{err}</p>
  if (!payload) return <p className="text-sm text-gray-500">Loading provisional transcript…</p>

  const semesters = payload.semesters ?? []

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Official cumulative attainment</p>
        <p className="mt-2 text-3xl font-black text-primary">
          {payload.latestCgpa !== null ? payload.latestCgpa.toFixed(2) : '—'}
        </p>
        <p className="text-xs text-gray-600 mt-1">CGPA is credit-weighted on the registrar&apos;s attainment ladder.</p>
      </div>

      <div className="space-y-5">
        {semesters.length === 0 ? (
          <p className="text-sm text-gray-600">Marks will appear semester-by-semester after your HOD submits official scores.</p>
        ) : null}

        {semesters.map((s) => (
          <div key={`${s.academicYear}-${s.semesterNumber}`} className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-900 text-white px-4 py-3 flex flex-wrap justify-between gap-2 items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/75">Period</p>
                <p className="font-bold">
                  {s.academicYear} · semester {s.semesterNumber}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold">Sem GPA {Number(s.semesterGpa ?? 0).toFixed(2)}</p>
                <p className="text-white/85">CGPA {Number(s.cumulativeGpa ?? 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Module</th>
                    <th className="px-4 py-2">Cr</th>
                    <th className="px-4 py-2">%</th>
                    <th className="px-4 py-2">Ltr</th>
                    <th className="px-4 py-2">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(s.units ?? []).map((u) => (
                    <tr key={u.unitCode + (u.title ?? '')}>
                      <td className="px-4 py-2 font-mono font-semibold">{u.unitCode}</td>
                      <td className="px-4 py-2 text-gray-800">{u.title}</td>
                      <td className="px-4 py-2">{u.credits}</td>
                      <td className="px-4 py-2">{u.scorePercent}</td>
                      <td className="px-4 py-2">{u.letter}</td>
                      <td className="px-4 py-2">{Number(u.gradePoint ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
