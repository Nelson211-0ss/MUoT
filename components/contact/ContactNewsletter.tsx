'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Mail } from 'lucide-react'

import GlassPanel from '@/components/contact/ui/GlassPanel'
import { fadeUp } from '@/components/contact/motion'

export default function ContactNewsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
    setEmail('')
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <section className="relative overflow-hidden bg-primary py-16 text-white md:py-20">
      <motion.div
        aria-hidden
        className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
      />
      <motion.div
        className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Stay connected</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Newsletter & community</h2>
            <p className="mt-4 max-w-md text-slate-300">
              Event notifications, academic updates, and portal announcements — delivered with clarity.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-secondary" aria-hidden />
                Semester registration reminders
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" aria-hidden />
                Admissions & campus news
              </li>
            </ul>
          </motion.div>
          <GlassPanel className="border-white/10 bg-white/5 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-primary"
              >
                {done ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden />
                    Subscribed
                  </>
                ) : (
                  'Subscribe'
                )}
              </motion.button>
            </form>
            <p className="mt-3 text-xs text-slate-500">Design preview — no email is sent.</p>
          </GlassPanel>
        </div>
      </motion.div>
    </section>
  )
}
