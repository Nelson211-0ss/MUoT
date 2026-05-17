'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Mail } from 'lucide-react'

import PremiumCtaBand from '@/components/marketing/PremiumCtaBand'

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
    <PremiumCtaBand
      eyebrow="Stay connected"
      title="Newsletter & community"
      description="Event notifications, academic updates, and portal announcements — delivered with clarity."
      bullets={[
        { icon: Bell, text: 'Semester registration reminders' },
        { icon: Mail, text: 'Admissions & campus news' },
      ]}
    >
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
    </PremiumCtaBand>
  )
}
