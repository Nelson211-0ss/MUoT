'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageLayout from '@/components/PageLayout'
import ApplicantPortalShell from '@/components/applicant-portal/ApplicantPortalShell'

const STATUS_ORDER = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'AWAITING_DOCUMENTS',
  'APPROVED',
  'AWAITING_PAYMENT',
  'ENROLLED',
  'REJECTED',
]

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
    return {
      pct: idx === -1 ? 28 : Math.min(100, Math.round(((idx + 1) / STATUS_ORDER.length) * 100)),
      label: status,
    }
  }, [snapshot])

  if (!snapshot) {
    return (
      <PageLayout title="Applicant portal" subtitle="Loading.." showBanner={false} showCta={false}>
        <ApplicantPortalShell>
          <p className="text-sm text-gray-600 dark:text-slate-400">Loading profile…</p>
        </ApplicantPortalShell>
      </PageLayout>
    )
  }

  const app = snapshot.application
  const onboardingTarget = `/applicant-portal/onboarding`

  return (
    <PageLayout title="Applicant dashboard" subtitle="Track your dossier · Magwi Admissions" showBanner={false} showCta={false}>
      <ApplicantPortalShell>
        <div className="space-y-6">
          {app?.status === 'ENROLLED' && !app.onboardingSeenAt ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/15 dark:border-emerald-400/30 p-4">
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-3">
                You are formally enrolled · finish onboarding cues for the LMS handoff.
              </p>
              <Link href={onboardingTarget} className="text-sm font-bold text-primary dark:text-secondary hover:underline">
                Open onboarding →
              </Link>
            </div>
          ) : null}

          <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-[#0b2f7a] dark:from-slate-900 dark:to-slate-950 text-white p-6 md:p-8 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl space-y-2">
                <p className="text-xs uppercase tracking-widest text-white/75">Prospective Jaguar</p>
                <h1 className="text-3xl md:text-[2rem] font-bold leading-tight">{snapshot.user?.email}</h1>
                <p className="text-sm text-white/80">
                  {snapshot.user?.emailVerified
                    ? 'Email verified ✓ Notifications & invoices stay consistent.'
                    : 'Verify email for SMS / OTP fallbacks · request a code anytime.'}{' '}
                  <button
                    type="button"
                    className="ml-2 inline-flex underline font-semibold"
                    onClick={async () => {
                      await fetch('/api/admissions/request-verify', { method: 'POST' })
                      alert(
                        process.env.NODE_ENV === 'production'
                          ? 'If email delivery is wired, OTP is queued.'
                          : 'Dev build: OTP returned from confirm endpoint logs only — check terminal.',
                      )
                    }}
                  >
                    Email OTP
                  </button>
                  <span className="mx-2">·</span>
                  <button
                    type="button"
                    className="underline font-semibold"
                    onClick={async () => {
                      alert('Forgot-password API: POST /api/admissions/forgot-password · reset via POST /api/admissions/reset-password.')
                    }}
                  >
                    Password reset endpoints
                  </button>
                </p>
              </div>
              <motion.div animate={{ rotate: [-1, 1, -1], y: [-2, 0, -2] }} transition={{ duration: 12, repeat: Infinity }}>
                <span className="inline-flex px-6 py-2 rounded-full border border-secondary/70 text-secondary font-bold tracking-wide text-[11px] uppercase">
                  {snapshot.user?.emailVerified ? 'Portfolio active' : 'Verify email'}
                </span>
              </motion.div>
            </div>

            <div className="mt-8 bg-white/10 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between text-xs uppercase font-bold tracking-widest mb-4">
                <span>Admission pipeline journey</span>
                <span className="text-secondary">{progress.pct}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/25 overflow-hidden">
                <motion.div
                  aria-hidden
                  className="h-full bg-secondary"
                  animate={{ width: `${progress.pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p className="text-[11px] text-white/80 mt-3">
                Snapshot stage:{' '}
                <span className="font-semibold text-white">{snapshot.application?.status ?? 'DRAFT'}</span>. Missing
                artifacts: {(snapshot.missingDocs ?? []).join(', ') || 'none flagged'}
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-gray-400">Programme</p>
              <p className="font-bold text-primary dark:text-secondary text-lg">{app?.program?.name ?? 'TBD — finish wizard'}</p>
              <p className="text-xs text-gray-500">{app?.intake?.label}</p>
              <Link className="text-xs font-semibold mt-4 inline-flex text-blue-700 dark:text-secondary" href="/applicant-portal/application">
                Open wizard →
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-gray-400">Desk messages</p>
              <div className="space-y-2 max-h-[150px] overflow-y-auto mt-3 text-xs">
                {(snapshot.application?.comments ?? []).length ? (
                  snapshot.application.comments.map((c) => (
                    <p key={c.id} className="border rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800/70">
                      {c.body}
                    </p>
                  ))
                ) : (
                  <p>No officer comments visible yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <p className="text-xs font-bold uppercase text-gray-400">Bell centre</p>
                <Link href="/applicant-portal/notifications" className="text-xs font-semibold text-blue-700 dark:text-secondary">
                  View inbox
                </Link>
              </div>
              <p className="text-4xl font-bold text-primary dark:text-secondary mt-2">{notes?.unreadCount ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-3">Unread in-app pings</p>
            </div>
          </div>

          {(snapshot.application?.timeline ?? []).slice(-5).reverse().map((t) => (
            <div key={t.id} className="text-xs text-gray-500 border rounded-xl px-3 py-2">
              • {new Date(t.createdAt).toLocaleString()} — {t.eventType}
            </div>
          ))}
        </div>
      </ApplicantPortalShell>
    </PageLayout>
  )
}
