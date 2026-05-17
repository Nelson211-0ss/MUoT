'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

/** @param {{ items: { q: string; a: string }[] }} props */
export default function AdmissionsFaqList({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const expanded = open === i
        return (
          <article key={item.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-start gap-3 px-5 py-4 text-left"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : i)}
            >
              <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" strokeWidth={1.75} aria-hidden />
              <span className="flex-1 font-semibold text-primary">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
            {expanded ? (
              <div className="border-t border-slate-100 px-5 pb-4 pl-[3.25rem] text-sm leading-relaxed text-slate-600">
                {item.a}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
