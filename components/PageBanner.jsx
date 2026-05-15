'use client'

import { motion } from 'framer-motion'

export default function PageBanner({ title, subtitle }) {
  return (
    <section className="relative bg-primary text-white overflow-hidden rounded-br-[60px] md:rounded-br-[100px]">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, #4a90d9 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {title}
            <span className="text-secondary">.</span>
          </h1>
          {subtitle && (
            <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
