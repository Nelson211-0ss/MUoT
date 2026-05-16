'use client'

import { useEffect, useState } from 'react'

import PageLayout from '@/components/PageLayout'
import ApplicantPortalShell from '@/components/applicant-portal/ApplicantPortalShell'

export default function ApplicantProfilePage() {
  const [snapshot, setSnapshot] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch('/api/admissions/me/application').then(async (res) => {
      const js = await res.json()
      if (res.ok) setSnapshot(js)
    })
  }, [])

  async function saveName(ev) {
    ev.preventDefault()
    const fd = new FormData(/** @type {HTMLFormElement} */ (ev.currentTarget))
    const name = String(fd.get('name') ?? '').trim()
    const res = await fetch('/api/admissions/me/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await res.json().catch(() => ({}))
    setStatus(
      res.ok ? { kind: 'ok', msg: 'Updated successfully.' } : { kind: 'err', msg: data.error || 'Unable to persist.' },
    )
    if (res.ok) {
      fetch('/api/admissions/me/application').then(async (r) => setSnapshot(await r.json()))
    }
  }

  if (!snapshot) {
    return (
      <PageLayout title="Applicant profile" subtitle="Minimal identity housekeeping." showBanner={false} showCta={false}>
        <ApplicantPortalShell>
          <p className="text-sm text-gray-500">Loading…</p>
        </ApplicantPortalShell>
      </PageLayout>
    )
  }

  const defaultName = snapshot.user?.name ?? snapshot.application?.fullName ?? ''

  return (
    <PageLayout title="Applicant profile" subtitle="Minimal identity housekeeping." showBanner={false} showCta={false}>
      <ApplicantPortalShell>
        <form key={defaultName} className="max-w-xl space-y-4" onSubmit={saveName}>
          <label className="grid gap-2 text-xs font-semibold uppercase text-gray-500">
            Full name alias
            <input
              name="name"
              defaultValue={defaultName}
              className="rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:border-white/10"
              required
              minLength={2}
            />
          </label>
          <p className="text-xs text-gray-600 dark:text-slate-400">Canonical SSO email: {snapshot.user?.email}</p>

          {status?.msg ? (
            <p className={`text-xs ${status.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>{status.msg}</p>
          ) : null}

          <button type="submit" className="rounded-lg bg-secondary text-primary font-bold px-5 py-2 text-sm hover:brightness-95">
            Save identity
          </button>
        </form>
      </ApplicantPortalShell>
    </PageLayout>
  )
}
