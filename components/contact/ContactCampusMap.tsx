'use client'

import Link from 'next/link'
import { ExternalLink, MapPin } from 'lucide-react'

import {
  CAMPUS_LOCATION,
  getCampusDirectionsUrl,
  getCampusMapEmbedUrl,
  getCampusMapViewUrl,
} from '@/lib/contact/content'

type ContactCampusMapProps = {
  className?: string
}

export default function ContactCampusMap({ className = '' }: ContactCampusMapProps) {
  const embedUrl = getCampusMapEmbedUrl()

  return (
    <div className={`relative min-h-[320px] overflow-hidden rounded-2xl bg-slate-200 lg:min-h-[400px] ${className}`}>
      <iframe
        title="Magwi University of Technology campus — Magwi, South Sudan"
        src={embedUrl}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" aria-hidden />

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 sm:right-auto sm:max-w-sm">
        <div className="rounded-xl border border-white/15 bg-slate-950/80 p-4 shadow-lg backdrop-blur-md">
          <p className="flex items-start gap-2 text-sm font-semibold text-white">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={1.75} aria-hidden />
            {CAMPUS_LOCATION.address}
          </p>
          <p className="mt-1 pl-6 text-xs text-slate-400">{CAMPUS_LOCATION.coordinates}</p>
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-2">
          <Link
            href={getCampusDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 text-xs font-bold text-primary transition-all hover:brightness-95"
          >
            Get directions
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            href={getCampusMapViewUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            Open in Maps
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}
