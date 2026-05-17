'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, Headphones, MapPin, Sparkles } from 'lucide-react'

import GlassPanel from '@/components/contact/ui/GlassPanel'
import { CONTACT_HERO, CONTACT_STATS } from '@/lib/contact/content'
import { fadeUp, stagger } from '@/components/contact/motion'

export default function ContactHero() {
  const reduced = useReducedMotion()

  return (
    <section className="relative overflow-hidden rounded-br-[60px] bg-primary text-white md:rounded-br-[100px]">
      {/* Dot grid — aligned with PageBanner */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, #4a90d9 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl"
        animate={reduced ? undefined : { opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-secondary/10 blur-3xl"
        animate={reduced ? undefined : { opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 md:py-12 lg:px-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10"
        >
          <div>
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary sm:text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {CONTACT_HERO.slogan}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
            >
              {CONTACT_HERO.title}
              <span className="text-secondary">.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base"
            >
              {CONTACT_HERO.subtitle}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href="#contact-form"
                className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-xs font-bold text-primary transition-all hover:brightness-95 sm:text-sm"
              >
                <Headphones className="h-3.5 w-3.5" aria-hidden />
                Contact Support
              </Link>
              <Link
                href="#campus"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/15 sm:text-sm"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Visit Campus
              </Link>
              <Link
                href="#contact-form"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/90 transition-colors hover:text-white sm:text-sm"
              >
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                Schedule Appointment
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} custom={4} className="space-y-3">
            <motion.div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {CONTACT_STATS.map((stat) => (
                <GlassPanel key={stat.label} hover className="p-3 sm:p-4">
                  <p className="text-lg font-bold text-secondary sm:text-xl">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px]">
                    {stat.label}
                  </p>
                </GlassPanel>
              ))}
            </motion.div>
            <GlassPanel className="flex items-center justify-between gap-3 p-3.5 sm:p-4">
              <div>
                <p className="text-xs font-semibold sm:text-sm">Live contact routing</p>
                <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">Smart desk assignment · Enterprise SLA</p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 sm:text-xs">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Online
              </span>
            </GlassPanel>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
