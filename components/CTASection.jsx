'use client'

import { GraduationCap, Sparkles } from 'lucide-react'

import PremiumCtaBand from '@/components/marketing/PremiumCtaBand'

export default function CTASection() {
  return (
    <PremiumCtaBand
      eyebrow="Your future starts here"
      title="Ready to Start Your Journey?"
      description="Join Magwi University of Technology and gain skills for the digital economy — applications are open for ICT programmes."
      bullets={[
        { icon: Sparkles, text: 'Online-first programmes built for working learners' },
        { icon: GraduationCap, text: 'Guided admissions from application to enrollment' },
      ]}
      actions={[
        { href: '/admissions/apply', label: 'Apply for Admission', variant: 'primary' },
        { href: '/programs', label: 'Explore programmes', variant: 'secondary' },
      ]}
    />
  )
}
