import { cn } from '@/lib/utils'

export function Progress({ value, className }: { value: number; className?: string }) {
  const v = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500"
        style={{ width: `${v}%` }}
      />
    </div>
  )
}
