'use client'

import { motion } from 'framer-motion'
import { Bus, Car, Navigation } from 'lucide-react'

import ContactCampusMap from '@/components/contact/ContactCampusMap'
import GlassPanel from '@/components/contact/ui/GlassPanel'
import { CAMPUS_LOCATION } from '@/lib/contact/content'
import { fadeUp, stagger } from '@/components/contact/motion'

export default function ContactLocation() {
  return (
    <section id="campus" className="bg-slate-50 py-16">
      <motion.div
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} custom={0} className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Campus</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Visit MUT in Magwi</h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          <motion.div variants={fadeUp} custom={1} className="lg:col-span-3">
            <ContactCampusMap />
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="space-y-4 lg:col-span-2">
            <GlassPanel className="border-slate-200/80 bg-white/90 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Landmarks</p>
              <ul className="space-y-2">
                {CAMPUS_LOCATION.landmarks.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <Navigation className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassPanel>
            <GlassPanel className="border-slate-200/80 bg-white/90 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Bus className="h-4 w-4 text-secondary" aria-hidden />
                Transportation
              </p>
              <p className="mt-2 text-sm text-slate-600">{CAMPUS_LOCATION.transport}</p>
            </GlassPanel>
            <GlassPanel className="border-slate-200/80 bg-white/90 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Car className="h-4 w-4 text-secondary" aria-hidden />
                Parking
              </p>
              <p className="mt-2 text-sm text-slate-600">{CAMPUS_LOCATION.parking}</p>
            </GlassPanel>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
