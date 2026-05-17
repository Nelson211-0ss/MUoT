'use client'

import { useState } from 'react'

export default function PortalPasswordSection() {
  const [status, setStatus] = useState(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setStatus(null)
    const form = e.currentTarget
    const currentPassword = form.currentPassword.value
    const newPassword = form.newPassword.value
    const confirm = form.confirm.value

    if (newPassword !== confirm) {
      setStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }

    setPending(true)
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Update failed.' })
        return
      }
      form.reset()
      setStatus({ type: 'success', message: 'Password updated.' })
    } catch {
      setStatus({ type: 'error', message: 'Network error.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <h3 className="font-bold text-primary mb-1">Password & security</h3>
      <p className="text-xs text-gray-500 mb-4">Choose a password at least 8 characters.</p>
      {status && (
        <p
          className={`text-sm rounded-md px-3 py-2 mb-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}
        >
          {status.message}
        </p>
      )}
      <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="w-full min-w-0 flex-1 sm:min-w-[8rem]">
          <label className="text-xs font-medium text-gray-500 block mb-1">Current password</label>
          <input
            name="currentPassword"
            type="password"
            required
            className="w-full border border-gray-200 p-2.5 rounded-md text-sm"
            disabled={pending}
          />
        </div>
        <div className="w-full min-w-0 flex-1 sm:min-w-[8rem]">
          <label className="text-xs font-medium text-gray-500 block mb-1">New password</label>
          <input
            name="newPassword"
            type="password"
            required
            minLength={8}
            className="w-full border border-gray-200 p-2.5 rounded-md text-sm"
            disabled={pending}
          />
        </div>
        <div className="w-full min-w-0 flex-1 sm:min-w-[8rem]">
          <label className="text-xs font-medium text-gray-500 block mb-1">Confirm new</label>
          <input
            name="confirm"
            type="password"
            required
            minLength={8}
            className="w-full border border-gray-200 p-2.5 rounded-md text-sm"
            disabled={pending}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-white px-5 py-2.5 rounded-md text-sm font-bold hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </section>
  )
}
