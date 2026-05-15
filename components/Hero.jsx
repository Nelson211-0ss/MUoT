'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Globe, GraduationCap, Code2 } from 'lucide-react'

import { homeHeroSlides as HERO_IMAGES } from '@/lib/siteImages'

const SLIDE_INTERVAL_MS = 5500

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((i) => (i + 1) % HERO_IMAGES.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const current = HERO_IMAGES[slide]

  const slideTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }

  return (
    <section className="relative bg-primary text-white overflow-hidden rounded-br-[80px] md:rounded-br-[120px]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, #4a90d9 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="30%" x2="35%" y2="55%" stroke="#5b9bd5" strokeWidth="1" />
          <line x1="35%" y1="55%" x2="55%" y2="40%" stroke="#5b9bd5" strokeWidth="1" />
          <line x1="55%" y1="40%" x2="75%" y2="65%" stroke="#5b9bd5" strokeWidth="1" />
          <line x1="75%" y1="65%" x2="90%" y2="35%" stroke="#5b9bd5" strokeWidth="1" />
          <circle cx="10%" cy="30%" r="4" fill="#5b9bd5" />
          <circle cx="35%" cy="55%" r="4" fill="#5b9bd5" />
          <circle cx="55%" cy="40%" r="4" fill="#5b9bd5" />
          <circle cx="75%" cy="65%" r="4" fill="#5b9bd5" />
          <circle cx="90%" cy="35%" r="4" fill="#5b9bd5" />
        </svg>
        <Globe className="absolute top-[18%] right-[28%] w-16 h-16 text-blue-400/25" strokeWidth={1} />
        <GraduationCap className="absolute top-[12%] right-[12%] w-20 h-20 text-blue-400/20" strokeWidth={1} />
        <Code2 className="absolute bottom-[28%] right-[8%] w-14 h-14 text-blue-400/25" strokeWidth={1} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-bold leading-[1.15] mb-5">
              Learn Anywhere.
              <br />
              Lead Everywhere
              <span className="text-secondary">.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/85 max-w-lg mb-8 leading-relaxed">
              Magwi University of Technology is an online university dedicated to providing world-class IT education,
              anytime, anywhere.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/programs"
                className="bg-secondary text-primary px-7 py-3 rounded-md font-bold text-sm sm:text-base hover:brightness-95 transition-all"
              >
                Explore Programs
              </Link>
              <Link
                href="/admissions"
                className="border-2 border-secondary text-white px-7 py-3 rounded-md font-bold text-sm sm:text-base hover:bg-secondary/10 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 flex justify-center lg:justify-end w-full"
          >
            <div className="relative w-full max-w-[min(100%,640px)] h-[280px] sm:h-[360px] md:h-[420px] lg:h-[460px] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.src}
                  initial={reduceMotion ? false : { x: '25%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={reduceMotion ? undefined : { x: '-25%', opacity: 0 }}
                  transition={slideTransition}
                  className="absolute inset-0 flex items-center justify-center lg:justify-end"
                >
                  <div className="relative h-[92%] w-full max-w-[min(100%,560px)] rounded-2xl overflow-hidden shadow-[0_28px_64px_-12px_rgba(0,0,0,0.45)] ring-2 ring-white/15">
                    <Image
                      src={current.src}
                      alt={current.alt}
                      fill
                      priority={slide === 0}
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover object-center select-none pointer-events-none"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 lg:left-auto lg:right-4 lg:translate-x-0 flex gap-2 z-20"
                aria-hidden
              >
                {HERO_IMAGES.map((img, i) => (
                  <span
                    key={img.src}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === slide ? 'w-8 bg-secondary' : 'w-1.5 bg-white/35'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
