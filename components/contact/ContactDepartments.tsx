'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail, Phone } from 'lucide-react'

import GlassPanel from '@/components/contact/ui/GlassPanel'
import { CONTACT_DEPARTMENTS } from '@/lib/contact/content'
import { fadeUp, stagger } from '@/components/contact/motion'
import { cn } from '@/lib/utils'

export default function ContactDepartments() {
  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <motion.div
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} custom={0} className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Departments</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Connect with the right team
          </h2>
          <p className="mt-3 text-slate-600">
            Premium service desks for every part of your university journey.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {CONTACT_DEPARTMENTS.map((dept, i) => {
            const Icon = dept.icon
            return (
              <motion.div key={dept.id} variants={fadeUp} custom={i + 1}>
                <GlassPanel
                  hover
                  className={cn(
                    'group h-full border-slate-200/80 bg-white/90 p-6',
                    'transition-shadow hover:shadow-2xl hover:shadow-primary/5',
                  )}
                >
                  <motion.div
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </motion.div>
                  <motion.div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{dept.title}</h3>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                        dept.available
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-slate-200 text-slate-500',
                      )}
                    >
                      {dept.available ? 'Available' : 'Away'}
                    </span>
                  </motion.div>
                  <p className="text-sm leading-relaxed text-slate-600">{dept.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                      {dept.email}
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                      {dept.phone}
                    </li>
                  </ul>
                  <p className="mt-2 text-xs text-slate-500">{dept.hours}</p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-secondary"
                  >
                    {dept.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </button>
                </GlassPanel>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
