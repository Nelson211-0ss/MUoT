'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'

import { FOOTER_CONTACT } from '@/lib/footer/data'
import { cn } from '@/lib/utils'
import { footerReveal } from '@/components/footer/motion'

type FooterContactProps = {
  index?: number
  className?: string
}

export default function FooterContact({ index = 3, className }: FooterContactProps) {
  const items: Array<{
    icon: typeof MapPin
    label: string
    content: string
    href?: string
    external?: boolean
  }> = [
    {
      icon: MapPin,
      label: 'Address',
      content: FOOTER_CONTACT.address,
    },
    {
      icon: Mail,
      label: 'Email',
      content: FOOTER_CONTACT.email,
      href: `mailto:${FOOTER_CONTACT.email}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      content: FOOTER_CONTACT.phone,
      href: `tel:${FOOTER_CONTACT.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Globe,
      label: 'Website',
      content: FOOTER_CONTACT.websiteLabel,
      href: FOOTER_CONTACT.website,
      external: true,
    },
  ]

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
        <Mail className="h-3.5 w-3.5 text-secondary" strokeWidth={1.75} aria-hidden />
        Contact
      </h3>
      <ul className="space-y-3">
        {items.map(({ icon: Icon, label, content, href, external }) => (
          <li key={label} className="flex gap-2.5 text-[13px]">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={1.75} aria-hidden />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              {href ? (
                <Link
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="mt-0.5 block text-slate-300 transition-colors hover:text-white"
                >
                  {content}
                </Link>
              ) : (
                <p className="mt-0.5 leading-snug text-slate-300">{content}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
