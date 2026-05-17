import Link from 'next/link'

/** Premium link card — shared across admissions, about, programs hub, e-learning. */
export default function FeatureCard({ icon: Icon, title, description, href, cta }) {
  const inner = (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20 text-primary">
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-bold text-primary">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
      {cta && href ? <span className="mt-4 text-sm font-semibold text-primary">{cta} →</span> : null}
    </article>
  )

  if (href) {
    return (
      <Link
        href={href}
        prefetch={false}
        className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {inner}
      </Link>
    )
  }

  return inner
}
