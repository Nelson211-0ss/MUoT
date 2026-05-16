export default function EcosystemPlaceholder({ title, description, footnote, children }) {
  return (
    <section className="rounded-2xl border border-dashed border-primary/25 bg-white p-8 shadow-sm max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">MUT ecosystem</p>
      <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
      {footnote ? <p className="text-xs text-gray-400 mt-4">{footnote}</p> : null}
    </section>
  )
}
