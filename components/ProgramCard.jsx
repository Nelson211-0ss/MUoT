'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Code2, Shield, BarChart3, Cloud } from 'lucide-react'

const programStyles = {
  'Software Development': {
    icon: Code2,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  'Software Engineering': {
    icon: Code2,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  Cybersecurity: {
    icon: Shield,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  'Data Science': {
    icon: BarChart3,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  'AI & Data Science': {
    icon: BarChart3,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  'Cloud Computing': {
    icon: Cloud,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  Networking: {
    icon: Cloud,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  'UI/UX Design': {
    icon: Code2,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
}

export default function ProgramCard({ title, desc, variant = 'home', coverImage, coverAlt }) {
  const style = programStyles[title] || programStyles['Software Development']
  const Icon = style.icon

  if (variant === 'home') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(7,28,77,0.08)] border border-gray-100/90 h-full flex flex-col"
      >
        {coverImage ? (
          <div className="relative aspect-[16/10] w-full shrink-0">
            <Image
              src={coverImage}
              alt={coverAlt || `${title} at Magwi University of Technology`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/35 to-transparent pointer-events-none" aria-hidden />
          </div>
        ) : null}
        <div className="p-5 flex gap-4 flex-1 flex-col">
          <div className="flex gap-4 flex-1">
            <div
              className={`shrink-0 w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center ${style.iconColor}`}
            >
              <Icon size={22} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-primary text-[15px] mb-1.5 leading-snug">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>
              <Link href="/programs" className="text-sm font-semibold text-[#0636a8] hover:text-primary transition-colors">
                View Program →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (variant === 'catalog') {
    return (
      <motion.article
        whileHover={{ y: -4 }}
        className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20 text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-bold text-primary">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{desc}</p>
        <Link href="/admissions/apply" className="mt-4 text-sm font-semibold text-primary hover:underline">
          Apply for this programme →
        </Link>
      </motion.article>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="mb-1.5 text-[15px] font-bold leading-snug text-primary">{title}</h3>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">{desc}</p>
          <Link href="/programs" className="text-sm font-semibold text-primary hover:underline">
            View programme →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
