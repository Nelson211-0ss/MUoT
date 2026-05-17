'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

type FloatingFieldProps = {
  label: string
  name: string
  type?: string
  as?: 'input' | 'textarea' | 'select'
  options?: { value: string; label: string }[]
  rows?: number
  required?: boolean
  disabled?: boolean
  className?: string
}

export default function FloatingField({
  label,
  name,
  type = 'text',
  as = 'input',
  options,
  rows = 5,
  required,
  disabled,
  className,
}: FloatingFieldProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const active = focused || hasValue

  const fieldClass = cn(
    'peer w-full rounded-xl border border-slate-200 bg-white px-4 pt-6 pb-2 text-sm text-slate-900 outline-none transition-all',
    'focus:border-primary focus:ring-2 focus:ring-primary/15',
    disabled && 'opacity-60',
  )

  const labelClass = cn(
    'pointer-events-none absolute left-4 transition-all duration-200',
    active
      ? 'top-2 text-[10px] font-semibold uppercase tracking-wider text-primary'
      : 'top-1/2 -translate-y-1/2 text-sm text-slate-500',
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setHasValue(e.target.value.length > 0)
  }

  return (
    <div className={cn('relative', className)}>
      {as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          disabled={disabled}
          className={fieldClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          className={cn(fieldClass, 'cursor-pointer appearance-none')}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          defaultValue=""
        >
          <option value="" disabled>
            {' '}
          </option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          disabled={disabled}
          className={fieldClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
        />
      )}
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  )
}
