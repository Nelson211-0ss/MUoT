'use client'

import { motion } from 'framer-motion'
import { Mail, MessageSquare, Shield } from 'lucide-react'

import ContactPremiumForm from '@/components/contact/ContactPremiumForm'
import GlassPanel from '@/components/contact/ui/GlassPanel'
import { fadeUp, stagger } from '@/components/contact/motion'

export default function ContactFormSection() {
  return (
    <section id="contact-form" className="py-16 md:py-20">
      <motion.div
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div variants={fadeUp} custom={0} className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Get in touch</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Ultra-premium contact form
            </h2>
            <p className="mt-4 max-w-md text-slate-600">
              Intelligent routing to the right desk. Designed for clarity, speed, and enterprise-grade trust.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Shield, text: 'Secure intake workflow (design preview)' },
                { icon: MessageSquare, text: 'Structured subjects for faster resolution' },
                { icon: Mail, text: 'Confirmation sent to your inbox' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <GlassPanel className="mt-8 hidden border-slate-200/80 bg-gradient-to-br from-primary/5 to-cyan-500/5 p-6 lg:block">
              <p className="text-sm font-semibold text-slate-900">MUT Smart University Platform</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                One portal for applicants, students, faculty, and administration — connected through modern digital
                infrastructure.
              </p>
            </GlassPanel>
          </motion.div>
          <motion.div variants={fadeUp} custom={1}>
            <ContactPremiumForm />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
