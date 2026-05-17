/** @param {{ items: { label: string; value: string; hint: string }[] }} props */
export default function AdmissionsStatGrid({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
          <p className="text-2xl font-bold text-primary">{item.value}</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{item.label}</p>
          <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
        </div>
      ))}
    </div>
  )
}
