import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import { homeSpotlight, homeCtaBackgroundSrc } from '@/lib/siteImages'

const highlights = [
  'Project-based courses that mirror real product teams',
  'Faculty with industry experience across Africa and beyond',
  'Flexible pacing so you can balance work, family, and study',
]

export function HomeSpotlightSection() {
  return (
    <section className="bg-white py-14 md:py-20 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/3] max-h-[420px] rounded-2xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(7,28,77,0.18)] ring-1 ring-black/5">
            <Image
              src={homeSpotlight.src}
              alt={homeSpotlight.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Our mission</p>
            <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-bold text-primary leading-tight mb-4">
              Equipping South Sudan and the region with world-class technology skills
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Magwi University of Technology (MUT) delivers rigorous, online-first programs in software, security, data,
              and cloud—so you can grow your career without putting life on hold.
            </p>
            <ul className="space-y-3.5 text-left max-w-xl mx-auto lg:mx-0">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3 text-sm md:text-[15px] text-gray-700 leading-snug">
                  <CheckCircle2 className="shrink-0 w-5 h-5 text-secondary mt-0.5" strokeWidth={2} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/about"
                className="inline-flex items-center justify-center border-2 border-primary text-primary px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                About MUT
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center text-sm font-semibold text-[#0636a8] hover:text-primary transition-colors px-2 py-2.5"
              >
                Talk to admissions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomeCtaSection() {
  return (
    <section className="relative py-16 md:py-[4.5rem] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image
          src={homeCtaBackgroundSrc}
          alt=""
          fill
          className="object-cover scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/92 to-[#05265c]/95" />
      </div>
      <div className="relative max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-[2.125rem] font-bold text-white leading-tight mb-4">
          Ready to take the next step?
        </h2>
        <p className="text-white/85 text-sm md:text-base leading-relaxed mb-8">
          Review admission requirements, prepare your documents, and start your application in minutes. Our team can
          help you choose the right program.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/admissions"
            className="bg-secondary text-primary px-8 py-3 rounded-md font-bold text-sm sm:text-base hover:brightness-95 transition-all shadow-lg shadow-black/20"
          >
            Start application
          </Link>
          <Link
            href="/programs"
            className="border-2 border-white/70 text-white px-8 py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors"
          >
            Browse all programs
          </Link>
        </div>
      </div>
    </section>
  )
}
