'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, Headphones, MapPin, Sparkles } from 'lucide-react'

import GlassPanel from '@/components/contact/ui/GlassPanel'
import { CONTACT_HERO, CONTACT_STATS } from '@/lib/contact/content'
import { easePremium, fadeUp, stagger } from '@/components/contact/motion'

export default function ContactHero() {
  const reduced = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {/* Grid + orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        animate={reduced ? undefined : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"
        animate={reduced ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
        animate={reduced ? undefined : { x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-10 lg:pb-28">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.p variants={fadeUp} custom={0} className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              <Sparkles className="h-4 w-4" aria-hidden />
              {CONTACT_HERO.slogan}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              {CONTACT_HERO.title}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {CONTACT_HERO.subtitle}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#contact-form"
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-primary transition-all hover:brightness-95"
              >
                <Headphones className="h-4 w-4" aria-hidden />
                Contact Support
              </Link>
              <Link
                href="#campus"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                Visit Campus
              </Link>
              <Link
                href="#contact-form"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:text-white"
              >
                <Calendar className="h-4 w-4" aria-hidden />
                Schedule Appointment
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} custom={4} className="relative">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {CONTACT_STATS.map((stat, i) => (
                <GlassPanel key={stat.label} hover className="p-5">
                  <p className="text-2xl font-bold text-secondary">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{stat.label}</p>
                </GlassPanel>
              ))}
            </div>
            <motion.div
              className="mt-4 hidden lg:block"
              animate={reduced ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: easePremium }}
            >
              <GlassPanel className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-sm font-semibold">Live contact routing</p>
                  <p className="mt-1 text-xs text-slate-400">Smart desk assignment · Enterprise SLA</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Online
                </span>
              </GlassPanel>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
