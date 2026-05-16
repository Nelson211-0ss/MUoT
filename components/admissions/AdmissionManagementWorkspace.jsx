'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { ADMISSION_STATUS } from '@/lib/admissions/constants'
import { P, normalizeRoleSlug } from '@/lib/rbac/constants'

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

  const adminSlug = normalizeRoleSlug(viewer?.role ?? '')
  const canFinalizeEnrollment =
    adminSlug === 'ADMIN' || adminSlug === 'SUPER_ADMIN' || permissionKeys.includes(P.ADMISSIONS_REGISTRAR_FINALIZE)

  const [applications, setApplications] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [statusMsg, setStatusMsg] = useState(null)
  const [waiveEnrollmentFee, setWaiveEnrollmentFee] = useState(false)

  const barMax = useMemo(() => Math.max(...(analytics?.byStatus?.map((b) => b.count) ?? [1]), 1), [analytics])

  const reloadApplicationsList = useCallback(async () => {
    const qs = new URLSearchParams()
    if (statusFilter) qs.set('status', statusFilter)
    if (filter.trim()) qs.set('q', filter.trim())
    try {
      const res = await fetch(`/api/admissions/office/applications?${qs}`)
      const d = await res.json()
      setApplications(Array.isArray(d.applications) ? d.applications : [])
    } catch {
      setApplications([])
    }
  }, [filter, statusFilter])

  useEffect(() => {
    void reloadApplicationsList()
  }, [reloadApplicationsList])

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
    void reloadApplicationsList()
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
        ? {
            tone: 'ok',
            msg: 'Payment verified — registrar may issue the student number here, or waive the levy if authorised.',
          }
        : { tone: 'err', msg: data.error ?? 'Cannot verify funds.' },
    )
    if (res.ok) void reloadApplicationsList()
    if (res.ok && selectedId) {
      const jd = await fetch(`/api/admissions/office/applications/${selectedId}`).then((x) => x.json())
      setDetail(jd.application ?? null)
    }
  }

  async function finalizeEnrollment() {
    const res = await fetch('/api/admissions/office/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: selectedId,
        waiveAdmissionFee: Boolean(waiveEnrollmentFee && canFinalizeEnrollment),
      }),
    })
    const data = await res.json()
    setStatusMsg(
      res.ok
        ? {
            tone: 'ok',
            msg: `Enrolled ✓ learner number ${data.studentLoginNumber}. Applicant inbox updated · add RESEND_API_KEY + MAIL_FROM to send SMTP via Resend (dev servers log previews when omitted).`,
          }
        : { tone: 'err', msg: data.error ?? 'Registrar enrollment blocked.' },
    )
    if (res.ok) {
      setWaiveEnrollmentFee(false)
      void reloadApplicationsList()
      if (selectedId) {
        const jd = await fetch(`/api/admissions/office/applications/${selectedId}`).then((x) => x.json())
        setDetail(jd.application ?? null)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-primary text-xl">Admissions HQ</h2>
        <p className="text-sm text-gray-600 mt-1">
          Desk session <span className="font-semibold">{viewer?.email ?? ''}</span> · All applicant dossiers submitted through the wizard appear here (
          submissions float to the top by default sorting).
        </p>
        <p className="text-xs text-gray-500 mt-2">
          <strong>Admit applicant</strong> records a provisional offer from <strong>Under review</strong> or{' '}
          <strong>Submitted</strong> (covers online pipelines and registrar-recorded dossiers). Finance desks verify acceptance payments unless you waive the
          levy on enrollment. <strong>Complete enrollment</strong> issues the provisional 10‑digit learner login and STUDENT SSO.
        </p>
      </div>

      {allow(P.ADMISSIONS_MANUAL_APPLICATION, P.ADMISSIONS_MANAGE) ? (
        <RegistrarManualApplicationForm reloadList={() => void reloadApplicationsList()} />
      ) : null}

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
            {Object.values(ADMISSION_STATUS).map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 max-h-[420px] overflow-y-auto border rounded-xl divide-y text-xs">
            {applications.length === 0 ? (
              <div className="px-4 py-8 text-gray-500 text-center leading-relaxed">No applications matched — widen filters or wait for applicants to submit.</div>
            ) : (
              applications.map((row) => (
                <button
                  type="button"
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`block w-full text-left px-3 py-3 hover:bg-slate-50 ${selectedId === row.id ? 'bg-secondary/30' : ''}`}
                >
                  <span className="font-semibold text-primary block">{row.applicant?.email}</span>
                  <span className="text-gray-600">{row.program?.name ?? 'Program TBD'}</span>
                  <span className="mt-2 block flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">{row.status}</Badge>
                    {row.studentNumber ? <span className="text-[10px] font-mono text-emerald-800">#{row.studentNumber}</span> : null}
                  </span>
                </button>
              ))
            )}
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
                <DeskActions
                  detail={detail}
                  allow={allow}
                  mutate={mutate}
                  finalizeEnrollment={finalizeEnrollment}
                  canFinalizeEnrollment={canFinalizeEnrollment}
                  waiveEnrollmentFee={waiveEnrollmentFee}
                  setWaiveEnrollmentFee={setWaiveEnrollmentFee}
                />

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

/** @param {{ reloadList: () => void }} props */
function RegistrarManualApplicationForm({ reloadList }) {
  const [catalog, setCatalog] = useState(/** @type {{ faculties?: object[]; intakes?: object[] } | null} */ (null))
  const [saving, setSaving] = useState(false)
  const [hint, setHint] = useState(/** @type {{ tone: string; msg: string } | null} */ (null))

  useEffect(() => {
    fetch('/api/admissions/catalog')
      .then((r) => r.json())
      .then((d) => setCatalog({ faculties: d.faculties ?? [], intakes: d.intakes ?? [] }))
      .catch(() => setCatalog({ faculties: [], intakes: [] }))
  }, [])

  /** @type {React.FormEventHandler<HTMLFormElement>} */
  async function onSubmit(ev) {
    ev.preventDefault()
    setHint(null)
    const fd = new FormData(/** @type {HTMLFormElement} */ (ev.currentTarget))
    const body = {
      email: String(fd.get('email') ?? '').trim(),
      fullName: String(fd.get('fullName') ?? '').trim(),
      password: String(fd.get('password') ?? ''),
      phone: String(fd.get('phone') ?? '').trim(),
      programId: String(fd.get('programId') ?? ''),
      intakeId: String(fd.get('intakeId') ?? ''),
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admissions/office/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setHint({ tone: 'err', msg: data.error ?? 'Could not record application.' })
        return
      }
      setHint({ tone: 'ok', msg: 'Application filed as submitted — admit from the pipeline list whenever ready.' })
      ev.currentTarget.reset()
      reloadList()
    } finally {
      setSaving(false)
    }
  }

  const programsFlat = catalog?.faculties?.flatMap((f) => (f.programs ?? []).map((p) => ({ ...p, facultyName: f.name }))) ?? []

  return (
    <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-primary">Record offline / paper application</h3>
      <p className="mt-1 text-xs text-gray-600 max-w-xl">
        Creates applicant SSO (when the email is new) and drops a <strong>SUBMITTED</strong> dossier at the desk. Share the provisional password securely so
        the learner can refine details online if needed — then admit and complete enrollment as usual.
      </p>
      {hint?.msg ? <p className={`mt-2 text-xs font-semibold ${hint.tone === 'err' ? 'text-red-600' : 'text-emerald-600'}`}>{hint.msg}</p> : null}
      {!catalog ? (
        <p className="mt-3 text-sm text-gray-500">Loading catalogue…</p>
      ) : programsFlat.length === 0 || !(catalog.intakes ?? []).length ? (
        <p className="mt-3 text-sm text-amber-800">Admission catalog is empty — seed programmes/intakes before recording.</p>
      ) : (
        <form className="mt-4 grid max-w-3xl gap-3 sm:grid-cols-2" onSubmit={onSubmit}>
          <label className="grid gap-1 text-xs font-semibold uppercase text-gray-600 sm:col-span-1">
            Email
            <input name="email" type="email" required className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </label>
          <label className="grid gap-1 text-xs font-semibold uppercase text-gray-600 sm:col-span-1">
            Full name
            <input name="fullName" required minLength={2} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-semibold uppercase text-gray-600 sm:col-span-1">
            Provisional password
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-semibold uppercase text-gray-600 sm:col-span-1">
            Phone (optional)
            <input name="phone" maxLength={40} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-semibold uppercase text-gray-600 sm:col-span-2">
            Programme
            <select name="programId" required className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal">
              <option value="">Select…</option>
              {programsFlat.map((p) => (
                <option key={p.id} value={p.id}>
                  {(p.facultyName ?? '').slice(0, 24)} · {p.code} — {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold uppercase text-gray-600 sm:col-span-2">
            Intake cohort
            <select name="intakeId" required className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal">
              <option value="">Select…</option>
              {(catalog.intakes ?? []).map((int) => (
                <option key={int.id} value={int.id}>
                  {int.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'File submitted application'}
          </button>
        </form>
      )}
    </section>
  )
}

function DeskActions({ allow, mutate, finalizeEnrollment, detail, canFinalizeEnrollment, waiveEnrollmentFee, setWaiveEnrollmentFee }) {
  const canReview = allow(P.ADMISSIONS_APPLICATION_REVIEW, P.ADMISSIONS_MANAGE)
  const verifiedPayment = (detail?.payments ?? []).some((pay) => pay.status === 'VERIFIED')
  const readyForEnrollment =
    canFinalizeEnrollment &&
    detail?.status === 'AWAITING_PAYMENT' &&
    (verifiedPayment || waiveEnrollmentFee)
  const enrollmentDisabled = !readyForEnrollment

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
        <button
          disabled={!canReview}
          type="button"
          className="text-xs px-3 py-2 rounded-xl bg-secondary font-bold disabled:opacity-40"
          title="Works from Under review or straight from Submitted dossiers · notifies applicant and exposes acceptance levy"
          onClick={() => mutate({ action: 'setStatus', status: 'PROVISIONAL_ACCEPT' })}
        >
          Admit applicant
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        {detail?.status === 'AWAITING_PAYMENT' && !verifiedPayment && canFinalizeEnrollment ? (
          <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-gray-700">
            <input type="checkbox" checked={waiveEnrollmentFee} onChange={(ev) => setWaiveEnrollmentFee(ev.target.checked)} />
            Acceptance fee waived or receipt recorded offline — allow enrollment anyway
          </label>
        ) : null}

        <div className="flex flex-wrap gap-2">
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
          <button
            disabled={enrollmentDisabled}
            type="button"
            title={
              !canFinalizeEnrollment
                ? 'Requires registrar finalize permission'
                : detail?.status !== 'AWAITING_PAYMENT'
                  ? 'Applicants must finish the admit + payment stage'
                  : !verifiedPayment && !waiveEnrollmentFee
                    ? 'Finance must verify PSP payment or waive the levy'
                    : 'Issues MUoT student number + STUDENT SSO'
            }
            className="text-xs px-3 py-2 rounded-xl border border-primary text-primary font-bold disabled:opacity-40"
            onClick={() => finalizeEnrollment()}
          >
            Complete enrollment · issue student number
          </button>
        </div>
      </div>
    </div>
  )
}
