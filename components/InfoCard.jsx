/** @param {{ icon?: import('react').ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; title: string; desc?: string; children?: import('react').ReactNode }} props */
export default function InfoCard({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:p-7">
      {Icon ? (
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20 text-primary">
          <Icon size={22} strokeWidth={1.75} aria-hidden />
        </span>
      ) : null}
      <h3 className="text-lg font-bold text-primary">{title}</h3>
      {desc ? <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{desc}</p> : null}
      {children}
    </div>
  )
}
