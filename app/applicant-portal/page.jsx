'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const STATUS_ORDER = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'APPROVED', 'AWAITING_PAYMENT', 'ENROLLED', 'REJECTED']

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
      if (notifs && notifs.ok) {
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
    return { pct, status }
  }, [snapshot])

  if (!snapshot) {
    return <p className="text-sm text-slate-500">Loading your dashboard…</p>
  }

  const app = snapshot.application
  const onboardingTarget = `/applicant-portal/onboarding`

  return (
    <div className="space-y-8">
      {app?.status === 'ENROLLED' && !app.onboardingSeenAt ? (
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50 px-5 py-4 dark:border-emerald-500/30 dark:bg-emerald-950/40">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
            You are enrolled · complete onboarding cues for registrar hand-off.
          </p>
          <Link href={onboardingTarget} prefetch={false} className="mt-2 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline dark:text-secondary">
            Open onboarding →
          </Link>
        </div>
      ) : null}

      {/* Summary */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Signed in</p>
            <p className="mt-1 truncate text-lg font-semibold text-slate-900 dark:text-white">{snapshot.user?.email ?? '—'}</p>
            <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              {snapshot.user?.emailVerified
                ? 'Email verified — desk updates and receipts use this inbox.'
                : 'Verify email for OTP fallbacks · request code from Admissions when wiring is enabled.'}{' '}
              <button
                type="button"
                className="font-semibold text-primary underline-offset-4 hover:underline dark:text-secondary"
                onClick={async () => {
                  await fetch('/api/admissions/request-verify', { method: 'POST' })
                  alert(process.env.NODE_ENV === 'production' ? 'Verification queued.' : 'Dev: OTP behaviour see server logs.')
                }}
              >
                Send verification request
              </button>
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:bg-white/10 dark:text-slate-100">
            {statusLabel(progress.status)}
          </span>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Admission progress</span>
            <span className="text-slate-800 dark:text-slate-200">{progress.pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              aria-hidden
              className="h-full rounded-full bg-slate-900 transition-[width] duration-500 dark:bg-secondary"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Missing items: {(snapshot.missingDocs ?? []).length ? snapshot.missingDocs.join(', ') : 'None flagged'}
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Programme</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{app?.program?.name ?? 'Complete wizard'}</p>
          <p className="text-xs text-slate-500">{app?.intake?.label ?? 'Intake pending'}</p>
          <Link href="/applicant-portal/application" prefetch={false} className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline dark:text-secondary">
            Continue application →
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Desk</p>
          <div className="mt-2 max-h-[128px] space-y-2 overflow-y-auto text-sm text-slate-700 dark:text-slate-300">
            {(snapshot.application?.comments ?? []).slice(0, 4).map((c) => (
              <p key={c.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs dark:border-white/10 dark:bg-slate-800/70">
                {c.body}
              </p>
            ))}
            {(snapshot.application?.comments ?? []).length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No officer notes yet.</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Notifications</p>
            <Link href="/applicant-portal/notifications" prefetch={false} className="text-sm font-semibold text-primary hover:underline dark:text-secondary">
              Open
            </Link>
          </div>
          <p className="mt-4 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{notes?.unreadCount ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Unread in-app updates</p>
        </article>
      </div>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Recent activity</p>
        <ul className="mt-4 space-y-2">
          {(snapshot.application?.timeline ?? [])
            .slice(-6)
            .reverse()
            .map((t) => (
              <li key={t.id} className="flex flex-wrap gap-x-2 text-xs text-slate-600 dark:text-slate-400">
                <time className="font-medium text-slate-500 dark:text-slate-500">{new Date(t.createdAt).toLocaleString()}</time>
                <span className="text-slate-800 dark:text-slate-200">{t.eventType}</span>
              </li>
            ))}
          {(snapshot.application?.timeline ?? []).length === 0 ? <li className="text-xs text-slate-500">No timeline events yet.</li> : null}
        </ul>
      </section>
    </div>
  )
}
