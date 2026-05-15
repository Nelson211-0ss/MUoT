'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary text-white rounded-xl md:rounded-2xl px-8 md:px-16 py-12 md:py-14 text-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #4a90d9 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Start Your Journey<span className="text-secondary">?</span>
          </h2>
          <p className="text-white/75 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Join Magwi University of Technology and gain skills for the digital economy.
          </p>
          <Link
            href="/admissions"
            className="inline-block bg-secondary text-primary px-8 py-3 rounded-md font-bold hover:brightness-95 transition-all"
          >
            Apply for Admission
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
