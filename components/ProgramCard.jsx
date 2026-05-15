'use client'

import Link from 'next/link'
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

export default function ProgramCard({ title, desc, variant = 'home' }) {
  const style = programStyles[title] || programStyles['Software Development']
  const Icon = style.icon

  if (variant === 'home') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 h-full"
      >
        <div className="flex gap-4">
          <div className={`shrink-0 w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center ${style.iconColor}`}>
            <Icon size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-primary text-[15px] mb-1.5 leading-snug">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>
            <Link href="/programs" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              View Program →
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 h-full"
    >
      <div className="flex gap-4">
        <div className={`shrink-0 w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center ${style.iconColor}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-primary text-[15px] mb-1.5 leading-snug">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>
          <Link href="/programs" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            View Program →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
