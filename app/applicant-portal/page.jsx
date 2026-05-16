'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Bell, FileText, GraduationCap, Upload } from 'lucide-react'

import { PageHeader } from '@/components/premium-ui/page-header'
import { StatCard } from '@/components/premium-ui/stat-card'
import { ProgressBar } from '@/components/premium-ui/progress-bar'

const STATUS_ORDER = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'APPROVED', 'AWAITING_PAYMENT', 'ENROLLED', 'REJECTED']

const STEPS = ['Profile', 'Program', 'Documents', 'Submit', 'Decision']

function statusLabel(raw) {
  return String(raw ?? 'DRAFT').replace(/_/g, ' ')
}

export default function ApplicantDashboardPage() {
  const [snapshot, setSnapshot] = useState(null)
  const [notes, setNotes] = useState(null)

  useEffect(() => {
    let canceled = false
    ;(async () => {
      const [me, notifs] = await Promise.all([
        fetch('/api/admissions/me/application'),
        fetch('/api/admissions/me/notifications').catch(() => null),
      ])
      const meData = await me.json()
      if (!me.ok) return
      if (!canceled) setSnapshot(meData)
      if (notifs?.ok) {
        const n = await notifs.json()
        if (!canceled) setNotes(n)
      }
    })()
    return () => {
      canceled = true
    }
  }, [])

  const progress = useMemo(() => {
    const status = snapshot?.application?.status ?? 'DRAFT'
    const idx = STATUS_ORDER.indexOf(status)
    const pct = idx === -1 ? 14 : Math.min(100, Math.round(((idx + 1) / STATUS_ORDER.length) * 100))
    const stepIdx = Math.min(STEPS.length - 1, Math.floor((pct / 100) * STEPS.length))
    return { pct, status, stepIdx }
  }, [snapshot])

  if (!snapshot) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200/80" />
          ))}
        </div>
      </div>
    )
  }

  const app = snapshot.application
  const onboardingTarget = '/applicant-portal/onboarding'

  return (
    <div className="space-y-8">
      <PageHeader
        title="Application dashboard"
        description={`Signed in as ${snapshot.user?.email ?? 'applicant'} · ${statusLabel(progress.status)}`}
        actions={
          <Link
            href="/applicant-portal/application"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Continue application
          </Link>
        }
      />

      {app?.status === 'ENROLLED' && !app.onboardingSeenAt ? (
        <div className="rounded-2xl border border-secondary bg-secondary/15 px-5 py-4">
          <p className="text-sm font-medium text-primary">You are enrolled — complete onboarding for registrar hand-off.</p>
          <Link href={onboardingTarget} className="mt-2 inline-flex text-sm font-semibold text-primary hover:underline">
            Open onboarding →
          </Link>
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Admission progress</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{app?.program?.name ?? 'Complete your programme selection'}</p>
            <p className="text-sm text-slate-500">{app?.intake?.label ?? 'Intake pending'}</p>
          </div>
          <span className="rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-secondary/40">
            {progress.pct}% complete
          </span>
        </div>
        <ProgressBar value={progress.pct} className="mt-6" />
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                  i <= progress.stepIdx ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {i + 1}
              </div>
              <span className="text-[11px] font-medium text-slate-600">{label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Missing documents: {(snapshot.missingDocs ?? []).length ? snapshot.missingDocs.join(', ') : 'None flagged'}
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Programme"
          value={app?.program?.code ?? '—'}
          hint={app?.program?.name ?? 'Open wizard to select'}
          icon={GraduationCap}
        />
        <StatCard label="Notifications" value={String(notes?.unreadCount ?? 0)} hint="Unread updates" icon={Bell} />
        <StatCard
          label="Documents"
          value={String((app?.documents ?? []).length)}
          hint="Uploaded to dossier"
          icon={Upload}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Desk messages</p>
          <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
            {(app?.comments ?? []).slice(0, 5).map((c) => (
              <p key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                {c.body}
              </p>
            ))}
            {(app?.comments ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No officer notes yet.</p>
            ) : null}
          </div>
          <Link href="/applicant-portal/notifications" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
            All notifications →
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Recent activity</p>
          <ul className="mt-3 space-y-2">
            {(app?.timeline ?? [])
              .slice(-6)
              .reverse()
              .map((t) => (
                <li key={t.id} className="flex gap-2 text-xs">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <div>
                    <time className="font-medium text-slate-500">{new Date(t.createdAt).toLocaleString()}</time>
                    <p className="text-slate-800">{t.eventType}</p>
                  </div>
                </li>
              ))}
            {(app?.timeline ?? []).length === 0 ? <li className="text-xs text-slate-500">No events yet.</li> : null}
          </ul>
        </article>
      </div>

      <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <p className="text-sm text-slate-600">
            Need to verify email?{' '}
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={async () => {
                await fetch('/api/admissions/request-verify', { method: 'POST' })
                alert(process.env.NODE_ENV === 'production' ? 'Verification queued.' : 'Dev: check server logs for OTP.')
              }}
            >
              Send verification request
            </button>
          </p>
        </div>
      </section>
    </div>
  )
}
