'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import type { FooterLinkGroup } from '@/lib/footer/data'
import { cn } from '@/lib/utils'
import { footerReveal, linkHover } from '@/components/footer/motion'

type FooterLinkColumnProps = {
  group: FooterLinkGroup
  index?: number
  className?: string
}

export default function FooterLinkColumn({ group, index = 0, className }: FooterLinkColumnProps) {
  const Icon = group.icon

  return (
    <motion.div
      custom={index}
      variants={footerReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={cn('min-w-0', className)}
    >
      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
        {Icon ? <Icon className="h-3.5 w-3.5 text-secondary" strokeWidth={1.75} aria-hidden /> : null}
        {group.title}
      </h3>
      <ul className="space-y-2">
        {group.links.map((link) => (
          <li key={link.label}>
            <motion.div variants={linkHover} initial="rest" whileHover="hover">
              <Link
                href={link.href}
                prefetch={link.href.startsWith('http') ? false : undefined}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="group inline-flex items-center gap-2 text-[13px] text-slate-400 transition-colors hover:text-white"
              >
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-secondary transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>{link.label}</span>
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
