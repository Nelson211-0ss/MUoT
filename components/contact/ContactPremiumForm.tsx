'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Send } from 'lucide-react'

import FloatingField from '@/components/contact/ui/FloatingField'
import GlassPanel from '@/components/contact/ui/GlassPanel'
import { toTitleCase } from '@/lib/toTitleCase'
import { FORM_DEPARTMENTS } from '@/lib/contact/content'
import { fadeUp } from '@/components/contact/motion'

type FormStatus = { type: 'success' | 'error'; message: string } | null

export default function ContactPremiumForm() {
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<FormStatus>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') || '').trim()
    const email = String(fd.get('email') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const department = String(fd.get('department') || '')
    const subject = String(fd.get('subject') || '').trim()
    const message = String(fd.get('message') || '').trim()

    if (!name || !email || !department || !subject || message.length < 10) {
      setStatus({ type: 'error', message: 'Please complete all required fields (message at least 10 characters).' })
      return
    }

    setPending(true)
    await new Promise((r) => setTimeout(r, 1400))
    setPending(false)
    setStatus({ type: 'success', message: 'Thank you — your message has been queued. Our team will respond shortly.' })
    form.reset()
  }

  return (
    <GlassPanel className="border-slate-200/80 bg-white/95 p-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Message us</p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900">{toTitleCase('Send a secure inquiry')}</h3>
        <p className="mt-2 text-sm text-slate-600">
          UI preview — submissions are simulated for this design build.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status ? (
          <motion.p
            key={status.type}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-5 rounded-xl px-4 py-3 text-sm ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-700'
                : 'bg-red-500/10 text-red-700'
            }`}
          >
            {status.message}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <FloatingField label="Full Name" name="name" required disabled={pending} />
        <FloatingField label="Email Address" name="email" type="email" required disabled={pending} />
        <FloatingField label="Phone Number" name="phone" type="tel" disabled={pending} />
        <FloatingField
          label="Department"
          name="department"
          as="select"
          options={FORM_DEPARTMENTS}
          required
          disabled={pending}
        />
        <div className="sm:col-span-2">
          <FloatingField label="Subject" name="subject" required disabled={pending} />
        </div>
        <motion.div variants={fadeUp} className="sm:col-span-2">
          <FloatingField label="Message" name="message" as="textarea" rows={5} required disabled={pending} />
        </motion.div>
        <div className="sm:col-span-2">
          <motion.button
            type="submit"
            disabled={pending}
            whileHover={{ scale: pending ? 1 : 1.01 }}
            whileTap={{ scale: pending ? 1 : 0.99 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : status?.type === 'success' ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Sent
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden />
                Submit message
              </>
            )}
          </motion.button>
        </div>
      </form>
    </GlassPanel>
  )
}
