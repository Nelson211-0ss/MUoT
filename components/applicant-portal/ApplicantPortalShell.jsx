'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FilePenLine,
  Upload,
  Wallet,
  Bell,
  ScrollText,
  UserCircle,
} from 'lucide-react'

const NAV = [
  { href: '/applicant-portal', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/applicant-portal/application', label: 'My Application', Icon: FilePenLine },
  { href: '/applicant-portal/documents', label: 'Upload Documents', Icon: Upload },
  { href: '/applicant-portal/payments', label: 'Payments', Icon: Wallet },
  { href: '/applicant-portal/notifications', label: 'Notifications', Icon: Bell },
  { href: '/applicant-portal/admission-letter', label: 'Admission Letter', Icon: ScrollText },
  { href: '/applicant-portal/profile', label: 'Profile Settings', Icon: UserCircle },
]

export default function ApplicantPortalShell({ children }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col lg:flex-row gap-10 min-h-[60vh]">
      <aside className="w-full lg:w-64 shrink-0">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-secondary mb-3 px-2">
            Applicant workspace
          </p>
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {NAV.map(({ href, label, Icon }) => {
              const active = pathname === href || (href !== '/applicant-portal' && pathname.startsWith(`${href}/`))
              return (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold whitespace-nowrap lg:whitespace-normal transition-colors ${
                    active
                      ? 'bg-primary text-white shadow-sm dark:bg-secondary dark:text-primary'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
      <div className="flex-1 min-w-0 space-y-6">{children}</div>
    </div>
  )
}
