'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import PageLayout from '@/components/PageLayout'
import LogoutButton from '@/components/LogoutButton'

export default function StudentSetupPasswordPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [msg, setMsg] = useState(null)

  async function onSubmit(ev) {
    ev.preventDefault()
    setMsg(null)
    const form = ev.currentTarget
    const currentPassword = form.currentPassword.value
    const next = form.newPassword.value
    const confirm = form.confirmPassword.value

    if (next !== confirm) {
      setMsg({ tone: 'err', text: 'New password and confirmation must match.' })
      return
    }

    setPending(true)
    try {
      const res = await fetch('/api/auth/student-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword: next }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg({ tone: 'err', text: data.error ?? 'Could not update password.' })
        return
      }
      router.push('/student-portal')
      router.refresh()
    } catch {
      setMsg({ tone: 'err', text: 'Network error. Try again.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <PageLayout
      title="Create your portal password"
      subtitle="Continue using your 10-digit student number to sign in. Choose a confidential password that is not derived from personal data."
      showBanner={false}
      showCta={false}
      showFooter={false}
    >
      <div className="max-w-md mx-auto space-y-6">
        {msg ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm font-semibold border ${
              msg.tone === 'ok'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-100'
                : 'bg-red-50 text-red-900 border-red-100'
            }`}
          >
            {msg.text}
          </p>
        ) : null}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Current password</label>
            <input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white dark:bg-slate-950 dark:border-white/10"
              disabled={pending}
              placeholder="First login defaults to your student number"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">New password</label>
            <input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white dark:bg-slate-950 dark:border-white/10"
              disabled={pending}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Confirm new password</label>
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white dark:bg-slate-950 dark:border-white/10"
              disabled={pending}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-primary text-white py-3.5 font-bold disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Activate student portal'}
          </button>
        </form>

        <div className="flex flex-wrap justify-between gap-3">
          <Link href="/login" className="text-xs font-semibold text-primary underline-offset-2 hover:underline">
            Wrong account?
          </Link>
          <LogoutButton className="text-xs font-semibold text-gray-600 border-0 underline underline-offset-2 hover:text-primary p-0 rounded-none shadow-none bg-transparent" />
        </div>
      </div>
    </PageLayout>
  )
}
