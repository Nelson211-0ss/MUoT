'use client'

import { motion } from 'framer-motion'

import { SOCIAL_BRAND_ICONS } from '@/components/icons/SocialBrandIcons'
import { FOOTER_SOCIAL } from '@/lib/footer/data'
import { cn } from '@/lib/utils'
import { socialIcon } from '@/components/footer/motion'

type FooterSocialProps = {
  className?: string
}

export default function FooterSocial({ className }: FooterSocialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className={cn(className)}
    >
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Connect with MUT</p>
      <ul className="flex flex-wrap gap-2" aria-label="Social media">
        {FOOTER_SOCIAL.map(({ label, href, network }) => {
          const Icon = SOCIAL_BRAND_ICONS[network]
          return (
            <li key={network}>
              <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} — opens in new tab`}
                variants={socialIcon}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white"
              >
                <Icon />
              </motion.a>
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
