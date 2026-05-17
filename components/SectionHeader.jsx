/** @param {{ eyebrow?: string; title: string; subtitle?: string; align?: 'left' | 'center' }} props */
export default function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`mb-8 md:mb-10 ${alignClass}`}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">{title}</h2>
      {subtitle ? (
        <p
          className={`mt-3 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
