/** @param {{ items: { label: string; value: string; hint?: string }[]; columns?: 2 | 3 | 4 }} props */
export default function StatGrid({ items, columns = 4 }) {
  const colClass =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`grid gap-4 ${colClass}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition-shadow hover:shadow-sm"
        >
          <p className="text-2xl font-bold text-primary">{item.value}</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{item.label}</p>
          {item.hint ? <p className="mt-1 text-xs text-slate-500">{item.hint}</p> : null}
        </div>
      ))}
    </div>
  )
}
