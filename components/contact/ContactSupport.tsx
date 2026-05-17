'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Clock, Ticket, Zap } from 'lucide-react'

import GlassPanel from '@/components/contact/ui/GlassPanel'
import { RESPONSE_CARDS, SUPPORT_CATEGORIES } from '@/lib/contact/content'
import { fadeUp, stagger } from '@/components/contact/motion'
import { cn } from '@/lib/utils'

export default function ContactSupport() {
  return (
    <section className="border-y border-slate-200/80 bg-white py-16">
      <motion.div
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} custom={0} className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Support center</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Smart support experience</h2>
          </motion.div>
          <GlassPanel className="inline-flex items-center gap-2 border-red-500/20 bg-red-500/5 px-4 py-2">
            <AlertCircle className="h-4 w-4 text-red-500" aria-hidden />
            <span className="text-xs font-semibold text-red-600">Emergency: +211 900 000 999</span>
          </GlassPanel>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-12">
          <motion.div variants={fadeUp} custom={1} className="lg:col-span-7">
            <div className="grid gap-3 sm:grid-cols-2">
              {SUPPORT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition-all hover:border-primary/30 hover:bg-white hover:shadow-lg"
                >
                  <Zap className="mb-3 h-5 w-5 text-secondary" aria-hidden />
                  <p className="font-semibold text-slate-900">{cat.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{cat.desc}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white sm:w-auto"
            >
              <Ticket className="h-4 w-4" aria-hidden />
              Open support ticket
            </button>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="space-y-4 lg:col-span-5">
            {RESPONSE_CARDS.map((card) => (
              <GlassPanel
                key={card.label}
                className="flex items-center justify-between border-slate-200/80 bg-white/90 p-5"
              >
                <motion.div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Clock className="h-4 w-4 text-secondary" aria-hidden />
                    {card.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{card.time}</p>
                </motion.div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase',
                    card.status === 'online'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-amber-500/10 text-amber-600',
                  )}
                >
                  {card.status === 'online' ? 'Live' : 'Busy'}
                </span>
              </GlassPanel>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
