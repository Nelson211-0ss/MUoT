import Image from 'next/image'

import { toTitleCase } from '@/lib/toTitleCase'

/** Split hero intro with image — used below PageBanner on marketing pages. */
export default function MediaIntroPanel({
  title,
  description,
  imageSrc = '/images/students.png',
  imageAlt = 'Students at Magwi University of Technology',
  badge = 'Magwi University of Technology',
  badgeSub = 'South Sudan',
  children,
  reverse = false,
}) {
  return (
    <section
      className={[
        'grid items-center gap-8 lg:grid-cols-2 lg:gap-12',
        reverse ? 'lg:[&>*:first-child]:order-2' : '',
      ].join(' ')}
    >
      <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-primary sm:min-h-[260px]">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover opacity-90" sizes="(max-width: 1024px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-primary/45" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-primary/90 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">{badge}</p>
          <p className="text-sm font-medium text-white/90">{badgeSub}</p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">{toTitleCase(title)}</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
        {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  )
}
