import Image from 'next/image'

/** @param {{ title: string; description: string; imageSrc?: string; imageAlt?: string; children?: import('react').ReactNode; reverse?: boolean }} props */
export default function AdmissionsMediaPanel({
  title,
  description,
  imageSrc = '/images/students.png',
  imageAlt = 'Students at Magwi University of Technology',
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
      <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-primary sm:min-h-[280px]">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover opacity-90" sizes="(max-width: 1024px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-primary/50" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-primary/90 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">Magwi University of Technology</p>
          <p className="text-sm font-medium text-white/90">Admissions · Jonglei</p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">{title}</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  )
}
