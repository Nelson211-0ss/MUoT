'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import {
  LayoutDashboard,
  FilePenLine,
  Upload,
  Wallet,
  Bell,
  ScrollText,
  UserCircle,
  ArrowUpRight,
} from 'lucide-react'

import PortalDeskShell, { deskNavLinkClass } from '@/components/portals/PortalDeskShell'
import LogoutButton from '@/components/LogoutButton'

const NAV = [
  { href: '/applicant-portal', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/applicant-portal/application', label: 'Application', Icon: FilePenLine },
  { href: '/applicant-portal/documents', label: 'Documents', Icon: Upload },
  { href: '/applicant-portal/payments', label: 'Payments', Icon: Wallet },
  { href: '/applicant-portal/notifications', label: 'Notifications', Icon: Bell },
  { href: '/applicant-portal/admission-letter', label: 'Admission letter', Icon: ScrollText },
  { href: '/applicant-portal/profile', label: 'Profile', Icon: UserCircle },
]

/** @returns {boolean} */
function navActive(pathname, href) {
  if (pathname === href) return true
  return href !== '/applicant-portal' && pathname.startsWith(`${href}/`)
}

function routeTitle(pathname) {
  if (pathname.startsWith('/applicant-portal/application')) return 'Application'
  if (pathname.startsWith('/applicant-portal/documents')) return 'Documents'
  if (pathname.startsWith('/applicant-portal/payments')) return 'Payments'
  if (pathname.startsWith('/applicant-portal/notifications')) return 'Notifications'
  if (pathname.startsWith('/applicant-portal/admission-letter')) return 'Admission letter'
  if (pathname.startsWith('/applicant-portal/profile')) return 'Profile'
  if (pathname.startsWith('/applicant-portal/onboarding')) return 'Onboarding'
  return 'Dashboard'
}

export default function ApplicantPortalFrame({ children }) {
  const pathname = usePathname()
  const title = useMemo(() => routeTitle(pathname ?? ''), [pathname])

  return (
    <PortalDeskShell
      badgeTitle="Applicant desk"
      badgeSubtitle="Magwi University of Technology"
      headerTitle={title}
      headerDescription="Track your admission journey"
      sidebar={(closeMobile) =>
        NAV.map(({ href, label, Icon }) => {
          const active = pathname ? navActive(pathname, href) : false
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              onClick={closeMobile}
              className={deskNavLinkClass(active)}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
              {label}
            </Link>
          )
        })
      }
      footer={
        <>
          <LogoutButton className="w-full rounded-lg border border-slate-200 bg-white py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60" />
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold text-slate-500 hover:text-primary"
          >
            Public site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
          </Link>
        </>
      }
    >
      {children}
    </PortalDeskShell>
  )
}
