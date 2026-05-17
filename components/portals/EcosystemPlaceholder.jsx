import { toTitleCase } from '@/lib/toTitleCase'

export default function EcosystemPlaceholder({ title, description, footnote, children }) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm max-w-2xl">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">MUoT ecosystem</p>
      <h2 className="mb-2 text-xl font-bold text-primary">{toTitleCase(title)}</h2>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
      {footnote ? <p className="text-xs text-gray-400 mt-4">{footnote}</p> : null}
    </section>
  )
}
