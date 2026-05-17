import { Calendar, ArrowRight } from 'lucide-react'

/** @param {{ title: string; description: string; date: string; category?: string }} props */
export default function NewsArticleCard({ title, description, date, category = 'University' }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
          {category}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {date}
        </span>
      </div>
      <h2 className="text-lg font-bold leading-snug text-primary">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
        Read more
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </article>
  )
}
