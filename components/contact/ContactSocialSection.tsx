'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { SOCIAL_BRAND_ICONS } from '@/components/icons/SocialBrandIcons'
import { FOOTER_SOCIAL } from '@/lib/footer/data'
import { fadeUp, stagger } from '@/components/contact/motion'
import { toTitleCase } from '@/lib/toTitleCase'

const GRADIENTS = [
  'from-blue-600/20 to-blue-900/5',
  'from-slate-600/20 to-slate-900/5',
  'from-cyan-600/15 to-primary/10',
  'from-pink-600/15 to-purple-900/5',
  'from-red-600/15 to-red-900/5',
]

export default function ContactSocialSection() {
  return (
    <section className="border-t border-slate-200/80 bg-slate-50 py-16">
      <motion.div
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Community</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{toTitleCase('Follow MUT online')}</h2>
        </motion.div>
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FOOTER_SOCIAL.map(({ label, href, network }, i) => {
            const Icon = SOCIAL_BRAND_ICONS[network]
            return (
              <motion.a
                key={network}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br p-6 ${GRADIENTS[i % GRADIENTS.length]}`}
              >
                <Icon className="h-8 w-8 text-slate-700 transition-colors group-hover:text-primary" />
                <p className="mt-4 font-semibold text-slate-900">{label}</p>
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.a>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
