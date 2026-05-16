'use client'

export function ProgressBar({ value, className = '' }) {
  const v = Math.min(100, Math.max(0, value))
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div className="h-full rounded-full bg-secondary transition-all duration-700" style={{ width: `${v}%` }} />
    </div>
  )
}
