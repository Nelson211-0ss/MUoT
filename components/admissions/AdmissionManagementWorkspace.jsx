'use client'

import { useEffect, useMemo, useState } from 'react'

import { P } from '@/lib/rbac/constants'

function Badge({ tone, children }) {
  const tones = {
    neutral: 'bg-slate-100 text-slate-800',
    good: 'bg-emerald-100 text-emerald-900',
    warn: 'bg-amber-100 text-amber-900',
  }
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>
}

/** @typedef {{ viewer: unknown; permissionKeys: string[] }} Props */

export default function AdmissionManagementWorkspace({ viewer, permissionKeys }) {
  const allow = (...keys) => keys.some((k) => permissionKeys.includes(k))

  const [applications, setApplications] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [statusMsg, setStatusMsg] = useState(null)

  const barMax = useMemo(() => Math.max(...(analytics?.byStatus?.map((b) => b.count) ?? [1]), 1), [analytics])

  useEffect(() => {
    const qs = new URLSearchParams()
    if (statusFilter) qs.set('status', statusFilter)
    if (filter.trim()) qs.set('q', filter.trim())
    fetch(`/api/admissions/office/applications?${qs}`)
      .then((r) => r.json())
      .then((d) => setApplications(Array.isArray(d.applications) ? d.applications : []))
      .catch(() => setApplications([]))
  }, [filter, statusFilter])

  useEffect(() => {
    if (!selectedId) {
      setDetail(null)
      return
    }
    fetch(`/api/admissions/office/applications/${selectedId}`)
      .then((r) => r.json())
      .then((d) => setDetail(d.application ?? null))
  }, [selectedId])

  useEffect(() => {
    if (!permissionKeys.includes(P.ADMISSIONS_ANALYTICS_VIEW)) return
    fetch(`/api/admissions/office/analytics`)
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(() => setAnalytics(null))
  }, [permissionKeys])

  async function mutate(actionPayload) {
    if (!selectedId) return
    setStatusMsg(null)
    const res = await fetch(`/api/admissions/office/applications/${selectedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionPayload),
    })
    const data = await res.json()
    if (!res.ok) {
      setStatusMsg({ tone: 'err', msg: data.error ?? 'Desk action failed.' })
      return
    }
    setDetail(data.application)
  }

  async function verifyFee(paymentId) {
    setStatusMsg(null)
    const res = await fetch('/api/admissions/office/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId }),
    })
    const data = await res.json()
    setStatusMsg(
      res.ok
        ? { tone: 'ok', msg: 'Payment verified ✓ Registrar may finalize.' }
        : { tone: 'err', msg: data.error ?? 'Cannot verify funds.' },
    )
  }

  async function finalizeEnrollment() {
    const res = await fetch('/api/admissions/office/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: selectedId }),
    })
    const data = await res.json()
    setStatusMsg(
      res.ok
        ? { tone: 'ok', msg: `Learner issuance · student login ${data.studentLoginNumber}` }
        : { tone: 'err', msg: data.error ?? 'Registrar guard blocked issuance.' },
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-primary text-xl">Admissions HQ</h2>
        <p className="text-sm text-gray-600 mt-1">
          Desk session <span className="font-semibold">{viewer?.email ?? ''}</span> · RBAC-scoped dossier choreography.
        </p>
      </div>

      {statusMsg ? (
        <p className={`text-xs font-semibold ${statusMsg.tone === 'err' ? 'text-red-600' : 'text-emerald-600'}`}>
          {statusMsg.msg}
        </p>
      ) : null}

      {analytics ? (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="font-semibold text-primary mb-3">Pipeline analytics</p>
          <div className="space-y-2 max-w-xl">
            {analytics.byStatus.map((stat) => (
              <div key={stat.status} className="flex items-center gap-3">
                <span className="w-32 text-[11px] uppercase font-bold text-gray-500">{stat.status}</span>
                <div className="flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    aria-hidden
                    className="h-2 rounded-full bg-secondary transition-all"
                    style={{ width: `${Math.min(100, (stat.count / barMax) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold">{stat.count}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            placeholder="Filter by email/name"
            value={filter}
            onChange={(ev) => setFilter(ev.target.value)}
            className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
          <select value={statusFilter} onChange={(ev) => setStatusFilter(ev.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All statuses</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="AWAITING_PAYMENT">AWAITING_PAYMENT</option>
          </select>
        </div>
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 max-h-[420px] overflow-y-auto border rounded-xl divide-y text-xs">
            {applications.map((row) => (
              <button
                type="button"
                key={row.id}
                onClick={() => setSelectedId(row.id)}
                className={`block w-full text-left px-3 py-3 hover:bg-slate-50 ${selectedId === row.id ? 'bg-secondary/30' : ''}`}
              >
                <span className="font-semibold text-primary block">{row.applicant?.email}</span>
                <span className="text-gray-600">{row.program?.name ?? 'Program TBD'}</span>
                <span className="mt-2 block">
                  <Badge tone="neutral">{row.status}</Badge>
                </span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 border rounded-xl p-4 bg-slate-50/80 text-xs max-h-[420px] overflow-y-auto space-y-4">
            {detail ? (
              <>
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-primary">{detail.fullName ?? 'Applicant'}</p>
                    <p className="text-gray-600">{detail.faculty?.name}</p>
                  </div>
                  <Badge tone="good">{detail.status}</Badge>
                </div>
                <DeskActions detail={detail} allow={allow} mutate={mutate} finalizeEnrollment={finalizeEnrollment} />

                {(detail.documents ?? []).length ? (
                  <div className="space-y-2">
                    <p className="font-bold text-[11px] uppercase text-gray-500">Documents</p>
                    {(detail.documents ?? []).map((doc) => (
                      <div key={doc.id} className="flex justify-between rounded-lg bg-white border px-3 py-2">
                        <span className="font-semibold">{doc.docType}</span>
                        <div className="flex gap-2">
                          <a className="font-semibold underline" href={`/api/admissions/office/documents/${doc.id}/file`} target="_blank" rel="noreferrer">
                            Preview
                          </a>
                          {allow(P.ADMISSIONS_DOCUMENTS_VERIFY, P.ADMISSIONS_MANAGE) ? (
                            <button type="button" className="font-semibold underline" onClick={() => mutate({ action: 'verifyDocument', documentId: doc.id, verified: true })}>
                              Verify
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No uploads queued.</p>
                )}

                {(detail.payments ?? []).length ? (
                  <div className="space-y-2 border-t pt-3">
                    <p className="font-bold text-[11px] uppercase text-gray-500">Payments</p>
                    {(detail.payments ?? []).map((pay) => (
                      <div key={pay.id} className="flex justify-between rounded-lg bg-white border px-3 py-2">
                        <Badge tone={pay.status === 'VERIFIED' ? 'good' : 'warn'}>{pay.status}</Badge>
                        <span>
                          {pay.amountMinor} {pay.currency}
                        </span>
                        {allow(P.ADMISSIONS_FINANCE_PAYMENT, P.FINANCE_MANAGE) && pay.status === 'PENDING' ? (
                          <button type="button" className="font-semibold underline" onClick={() => verifyFee(pay.id)}>
                            Verify
                          </button>
                        ) : (
                          <span />
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <p>Select a row to orchestrate dossier tooling.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function DeskActions({ allow, mutate, finalizeEnrollment, detail }) {
  const canReview = allow(P.ADMISSIONS_APPLICATION_REVIEW, P.ADMISSIONS_MANAGE)
  const registrarLock = !(
    allow(P.ADMISSIONS_REGISTRAR_FINALIZE, P.ADMISSIONS_MANAGE) && detail?.status === 'AWAITING_PAYMENT'
  )

  return (
    <div className="space-y-2 border-b pb-3">
      <div className="flex flex-wrap gap-2">
        <button disabled={!canReview} type="button" className="text-xs px-3 py-1 rounded-lg border bg-white disabled:opacity-40" onClick={() => mutate({ action: 'setStatus', status: 'UNDER_REVIEW' })}>
          Move under review
        </button>
        <button disabled={!canReview} type="button" className="text-xs px-3 py-1 rounded-lg border bg-white disabled:opacity-40" onClick={() => mutate({ action: 'setStatus', status: 'AWAITING_DOCUMENTS' })}>
          Request dossier uplift
        </button>
        <button disabled={!canReview} type="button" className="text-xs px-3 py-1 rounded-lg border bg-white disabled:opacity-40" onClick={() => mutate({ action: 'setStatus', status: 'REJECTED' })}>
          Reject intake
        </button>
        <button disabled={!canReview} type="button" className="text-xs px-3 py-1 rounded-lg bg-secondary disabled:opacity-40" onClick={() => mutate({ action: 'setStatus', status: 'PROVISIONAL_ACCEPT' })}>
          Provisional clearance
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          disabled={!canReview}
          type="button"
          className="text-xs px-3 py-2 rounded-xl bg-primary text-white disabled:opacity-40"
          onClick={() =>
            mutate({
              action: 'comment',
              visibility: 'APPLICANT',
              body: window.prompt('Note to applicant', 'Update from Admissions') ?? '',
            })
          }
        >
          Ping applicant inbox
        </button>
        <button disabled={registrarLock} type="button" className="text-xs px-3 py-2 rounded-xl border font-bold disabled:opacity-40" onClick={() => finalizeEnrollment()}>
          Registrar finalize → student SSO
        </button>
      </div>
    </div>
  )
}
