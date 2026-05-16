'use client'

import { useEffect, useState } from 'react'

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
    setStatus(res.ok ? { kind: 'ok', msg: 'Updated successfully.' } : { kind: 'err', msg: data.error || 'Unable to persist.' })
    if (res.ok) {
      fetch('/api/admissions/me/application').then(async (r) => setSnapshot(await r.json()))
    }
  }

  if (!snapshot) {
    return <p className="text-sm text-slate-500">Loading…</p>
  }

  const defaultName = snapshot.user?.name ?? snapshot.application?.fullName ?? ''

  return (
    <form key={defaultName} className="max-w-md space-y-4" onSubmit={saveName}>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Full name
        <input
          name="name"
          defaultValue={defaultName}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          required
          minLength={2}
        />
      </label>
      <p className="text-xs text-slate-500">Account email: <span className="font-medium text-slate-700">{snapshot.user?.email}</span></p>

      {status?.msg ? <p className={`text-xs ${status.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>{status.msg}</p> : null}

      <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
        Save
      </button>
    </form>
  )
}
