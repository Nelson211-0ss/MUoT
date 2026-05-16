'use client'

import { useEffect, useState } from 'react'

import PageLayout from '@/components/PageLayout'
import ApplicantPortalShell from '@/components/applicant-portal/ApplicantPortalShell'

export default function ApplicantNotificationsPage() {
  const [items, setItems] = useState([])
  useEffect(() => {
    fetch('/api/admissions/me/notifications').then(async (res) => {
      const json = await res.json()
      if (res.ok) setItems(json.notifications ?? [])
    })
  }, [])

  async function mark(ids) {
    await fetch('/api/admissions/me/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    setItems((rows) =>
      rows.map((n) =>
        ids.includes(n.id)
          ? {
              ...n,
              readAt: new Date().toISOString(),
            }
          : n,
      ),
    )
  }

  return (
    <PageLayout title="Notifications" subtitle="Operational alerts from Admissions, Finance & ICT." showCta={false}>
      <ApplicantPortalShell>
        <button
          type="button"
          className="text-xs font-semibold text-primary mb-4"
          onClick={() =>
            mark(
              items.filter((x) => !x.readAt).map((x) => x.id),
            )
          }
        >
          Mark all read
        </button>
        <div className="space-y-3">
          {(items ?? []).length ? (
            items.map((n) => (
              <button
                type="button"
                key={n.id}
                onClick={() => {
                  if (!n.readAt) mark([n.id])
                }}
                className={`block w-full text-left rounded-xl border px-4 py-3 shadow-sm hover:border-secondary transition-colors ${
                  n.readAt
                    ? 'bg-white dark:bg-slate-900 dark:border-white/10'
                    : 'bg-yellow-50 border-yellow-300 dark:bg-yellow-500/15 dark:border-yellow-400'
                }`}
              >
                <p className="font-bold text-primary dark:text-secondary text-sm">{n.title}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">{n.body}</p>
                <time className="text-[11px] text-gray-400 mt-2 block">{new Date(n.createdAt).toLocaleString()}</time>
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">Quiet inbox ✨</p>
          )}
        </div>
      </ApplicantPortalShell>
    </PageLayout>
  )
}
