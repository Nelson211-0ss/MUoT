'use client'

import { useEffect, useState } from 'react'

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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">Messages from Admissions and Finance.</p>
        <button
          type="button"
          className="text-xs font-semibold text-primary hover:underline"
          onClick={() => mark(items.filter((x) => !x.readAt).map((x) => x.id))}
        >
          Mark all read
        </button>
      </div>
      <div className="space-y-2">
        {items.length ? (
          items.map((n) => (
            <button
              type="button"
              key={n.id}
              onClick={() => {
                if (!n.readAt) mark([n.id])
              }}
              className={`block w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                n.readAt ? 'border-slate-200 bg-white' : 'border-secondary/50 bg-secondary/10'
              }`}
            >
              <p className="font-semibold text-slate-900">{n.title}</p>
              <p className="mt-1 text-xs text-slate-600">{n.body}</p>
              <time className="mt-2 block text-[11px] text-slate-400">{new Date(n.createdAt).toLocaleString()}</time>
            </button>
          ))
        ) : (
          <p className="text-sm text-slate-500">No messages yet.</p>
        )}
      </div>
    </div>
  )
}
