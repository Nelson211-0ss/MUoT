'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type GlassPanelProps = {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassPanel({ children, className, hover = false }: GlassPanelProps) {
  const Comp = hover ? motion.div : 'div'
  const hoverProps = hover
    ? { whileHover: { y: -4, transition: { duration: 0.25 } } }
    : {}

  return (
    <Comp
      {...hoverProps}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/10 backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </Comp>
  )
}
