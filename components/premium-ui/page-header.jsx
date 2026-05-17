'use client'

import { motion } from 'framer-motion'

import { toTitleCase } from '@/lib/toTitleCase'

export function PageHeader({ title, description, actions }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">{toTitleCase(title)}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </motion.header>
  )
}
