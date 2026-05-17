'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

import { CONTACT_FAQS, FAQ_CATEGORIES, type FaqCategory } from '@/lib/contact/content'
import { fadeUp, stagger } from '@/components/contact/motion'
import { cn } from '@/lib/utils'

export default function ContactFaqSection() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<FaqCategory>('all')
  const [openId, setOpenId] = useState<string | null>(CONTACT_FAQS[0]?.id ?? null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CONTACT_FAQS.filter((item) => {
      const catOk = category === 'all' || item.category === category
      const searchOk = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      return catOk && searchOk
    })
  }, [query, category])

  return (
    <section className="py-16 md:py-20">
      <motion.div
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} custom={0} className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Answers, instantly</h2>
        </motion.div>

        <motion.div variants={fadeUp} custom={1} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FAQ_CATEGORIES.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  category === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500"
              >
                No questions match your search.
              </motion.p>
            ) : (
              filtered.map((item) => {
                const open = openId === item.id
                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : item.id)}
                    >
                      <span className="font-semibold text-slate-900">{item.q}</span>
                      <ChevronDown
                        className={cn('h-5 w-5 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')}
                        aria-hidden
                      />
                    </button>
                    <AnimatePresence>
                      {open ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="border-t border-slate-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-slate-600">
                            {item.a}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.article>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
