'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * Premium navy CTA band — matches the contact page “Stay connected” layout.
 * Left: eyebrow, title, description, optional bullet list. Right: glass action panel.
 *
 * @param {object} props
 * @param {string} [props.id]
 * @param {string} [props.eyebrow]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {{ icon: import('lucide-react').LucideIcon; text: string }[]} [props.bullets]
 * @param {{ href: string; label: string; variant?: 'primary' | 'secondary' }[]} [props.actions]
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.fullBleed]
 * @param {string} [props.className]
 */
export default function PremiumCtaBand({
  id,
  eyebrow = 'Take the next step',
  title,
  description,
  bullets = [],
  actions = [],
  children,
  fullBleed = true,
  className = '',
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden bg-primary text-white',
        fullBleed ? 'py-16 md:py-20' : 'rounded-2xl',
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-secondary/10 blur-3xl"
      />

      <motion.div
        className={cn(
          'relative mx-auto max-w-[1400px]',
          fullBleed ? 'px-4 sm:px-6 lg:px-10' : 'px-6 py-10 sm:px-10 sm:py-12',
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
            ) : null}
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            {description ? (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>
            ) : null}
            {bullets.length > 0 ? (
              <ul className="mt-6 space-y-2.5">
                {bullets.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={1.75} aria-hidden />
                    {text}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-8"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25 }}
          >
            {children ?? (
              <div className="flex flex-col gap-3">
                {actions.map((action, i) => {
                  const isPrimary = action.variant !== 'secondary'
                  if (isPrimary) {
                    return (
                      <Link
                        key={action.href + action.label}
                        href={action.href}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-primary transition-all hover:brightness-95"
                      >
                        {action.label}
                        <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                      </Link>
                    )
                  }
                  return (
                    <Link
                      key={action.href + action.label}
                      href={action.href}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      {action.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
