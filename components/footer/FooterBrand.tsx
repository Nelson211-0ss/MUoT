'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

import Logo from '@/components/Logo'
import { FOOTER_BRAND } from '@/lib/footer/data'
import { footerReveal } from '@/components/footer/motion'

export default function FooterBrand() {
  return (
    <motion.div
      custom={0}
      variants={footerReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="min-w-0 sm:col-span-2 lg:col-span-6 xl:col-span-3"
    >
      <motion.div
        className="flex items-start gap-3.5 sm:gap-4"
        whileHover={{ opacity: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Logo className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">{FOOTER_BRAND.acronym}</p>
          <h2 className="mt-0.5 text-base font-bold leading-snug text-white sm:text-lg">{FOOTER_BRAND.name}</h2>
          <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium leading-snug text-slate-300">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" strokeWidth={1.75} aria-hidden />
            {FOOTER_BRAND.slogan}
          </p>
        </div>
      </motion.div>
      <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-slate-400 sm:max-w-md">{FOOTER_BRAND.description}</p>
    </motion.div>
  )
}
