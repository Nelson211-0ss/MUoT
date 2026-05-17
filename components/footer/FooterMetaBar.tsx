'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import { motion } from 'framer-motion'

import { FOOTER_LEGAL } from '@/lib/footer/data'

export default function FooterMetaBar() {
  const year = new Date().getFullYear()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="border-t border-slate-800/90 pb-8 pt-6 md:pb-10"
    >
      <p className="flex flex-nowrap items-center gap-x-3 overflow-x-auto text-xs text-slate-500 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
        {FOOTER_LEGAL.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 ? <span className="text-slate-600" aria-hidden>·</span> : null}
            <Link href={item.href} className="whitespace-nowrap transition-colors hover:text-white">
              {item.label}
            </Link>
          </Fragment>
        ))}
        <span className="text-slate-600" aria-hidden>·</span>
        <span className="whitespace-nowrap">
          © {year} Magwi University of Technology. All Rights Reserved.
        </span>
      </p>
    </motion.div>
  )
}
