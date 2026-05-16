'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/** Smooth cubic ease-out suited to content fly-ins */
const ease = [0.16, 1, 0.3, 1]

/**
 * Animates route content when pathname changes (use below Navbar).
 */
export function AnimateRouteShell({ children, className = '' }) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div key={pathname} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** One-time fly-in when the subtree mounts */
export function FlyInMount({ children, className = '' }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.58, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Scroll-triggered fly-in */
export function RevealFlyIn({ children, className = '', delay = 0, y = 44 }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-36px', amount: 0.08 }}
      transition={{ duration: 0.62, delay, ease }}
    >
      {children}
    </motion.div>
  )
}
