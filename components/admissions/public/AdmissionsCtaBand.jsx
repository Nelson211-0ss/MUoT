'use client'

import { ClipboardList, Shield } from 'lucide-react'

import PremiumCtaBand from '@/components/marketing/PremiumCtaBand'

/** @param {{ title?: string; description?: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string; eyebrow?: string; bullets?: { icon: import('react').ComponentType<{ className?: string; strokeWidth?: number }>; text: string }[] }} props */
export default function AdmissionsCtaBand({
  eyebrow = 'Admissions',
  title = 'Ready to begin?',
  description = 'Create your applicant account and start the online dossier in minutes.',
  primaryHref = '/admissions/apply',
  primaryLabel = 'Apply now',
  secondaryHref = '/login?intent=applicant',
  secondaryLabel = 'Sign in to applicant portal',
  bullets = [
    { icon: ClipboardList, text: 'Step-by-step application wizard' },
    { icon: Shield, text: 'Secure applicant portal & document uploads' },
  ],
}) {
  return (
    <PremiumCtaBand
      fullBleed={false}
      eyebrow={eyebrow}
      title={title}
      description={description}
      bullets={bullets}
      actions={[
        { href: primaryHref, label: primaryLabel, variant: 'primary' },
        { href: secondaryHref, label: secondaryLabel, variant: 'secondary' },
      ]}
    />
  )
}
