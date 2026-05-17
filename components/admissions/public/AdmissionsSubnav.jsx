'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ADMISSIONS_NAV } from '@/lib/admissions/public-pages'

export default function AdmissionsSubnav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Admissions sections"
      className="-mt-2 mb-10 overflow-x-auto border-b border-slate-200 pb-px md:mb-12"
    >
      <ul className="flex min-w-max gap-1 sm:gap-2">
        {ADMISSIONS_NAV.map(({ href, label }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                prefetch={false}
                className={[
                  'inline-block rounded-t-lg px-3 py-2.5 text-[13px] font-semibold transition-colors sm:px-4 sm:text-sm',
                  active
                    ? 'border-b-2 border-secondary bg-primary/5 text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary',
                ].join(' ')}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
