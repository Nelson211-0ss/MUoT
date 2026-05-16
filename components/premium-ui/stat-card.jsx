'use client'

import { motion } from 'framer-motion'

export function StatCard({ label, value, hint, icon: Icon, trend = 'neutral' }) {
  const trendClass =
    trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-red-600' : 'text-slate-500'

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-primary">{value}</p>
          {hint ? <p className={`mt-1 text-xs font-medium ${trendClass}`}>{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-primary">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
        ) : null}
      </div>
    </motion.article>
  )
}
