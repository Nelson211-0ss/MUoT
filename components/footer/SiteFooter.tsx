'use client'

import { motion, useReducedMotion } from 'framer-motion'

import FooterBrand from '@/components/footer/FooterBrand'
import FooterContact from '@/components/footer/FooterContact'
import FooterLinkColumn from '@/components/footer/FooterLinkColumn'
import FooterMetaBar from '@/components/footer/FooterMetaBar'
import FooterSocial from '@/components/footer/FooterSocial'
import { FOOTER_LINK_COLUMNS } from '@/lib/footer/data'
import { footerStagger } from '@/components/footer/motion'

export default function SiteFooter() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <footer className="relative mt-auto overflow-hidden bg-slate-950 text-slate-400 dark:bg-slate-950">
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <motion.div
          className="py-10 md:py-12"
          variants={prefersReducedMotion ? undefined : footerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-9 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8 xl:grid-cols-12 xl:gap-x-8"
            variants={prefersReducedMotion ? undefined : footerStagger}
          >
            <FooterBrand />

            {FOOTER_LINK_COLUMNS.map((group, i) => (
              <FooterLinkColumn
                key={group.id}
                group={group}
                index={i + 1}
                className="sm:col-span-1 lg:col-span-2 xl:col-span-2"
              />
            ))}

            <motion.div className="flex min-w-0 flex-col gap-6 sm:col-span-2 lg:col-span-6 xl:col-span-3">
              <FooterContact index={4} />
              <FooterSocial />
            </motion.div>
          </motion.div>
        </motion.div>

        <FooterMetaBar />
      </div>
    </footer>
  )
}
