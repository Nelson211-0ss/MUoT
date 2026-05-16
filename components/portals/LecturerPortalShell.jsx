'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { LayoutDashboard, BarChart3, MessageSquare, Settings, FileBarChart2, ArrowUpRight } from 'lucide-react'
import { useMemo } from 'react'
import PortalDeskShell from '@/components/portals/PortalDeskShell'
import EcosystemPlaceholder from '@/components/portals/EcosystemPlaceholder'
import PortalPasswordSection from '@/components/PortalPasswordSection'
import LogoutButton from '@/components/LogoutButton'
import MoodleHubCallout from '@/components/MoodleHubCallout'

const LECTURER_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'lecturer.nav.dashboard' },
  { id: 'reports', label: 'Reports', icon: FileBarChart2, permission: 'lecturer.nav.reports' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, permission: 'lecturer.nav.messages' },
  { id: 'settings', label: 'Settings', icon: Settings, permission: 'lecturer.nav.settings' },
]

export default function LecturerPortalShell({ faculty, permissionKeys = [] }) {
  const searchParams = useSearchParams()
  const raw = searchParams.get('tab') ?? 'dashboard'

  const navPermitted = useMemo(
    () => LECTURER_NAV.filter((item) => permissionKeys.includes(item.permission)),
    [permissionKeys],
  )

  const tab = navPermitted.some((t) => t.id === raw) ? raw : navPermitted[0]?.id ?? 'dashboard'

  const title = useMemo(() => {
    const t = navPermitted.find((x) => x.id === tab)
    return t?.label ?? 'Portal'
  }, [tab, navPermitted])

  if (navPermitted.length === 0) {
    return (
      <PortalDeskShell
        badgeTitle="Faculty desk"
        badgeSubtitle="Navigation unavailable"
        headerTitle="Access"
        sidebar={() => null}
        footer={
          <>
            <LogoutButton className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60" />
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-1 rounded-xl py-2 text-[12px] font-semibold text-slate-500 hover:text-primary"
            >
              Public site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
            </Link>
          </>
        }
      >
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm text-gray-700 space-y-4">
          <p>Your profile is missing lecturer navigation scopes. Contact the registrar or super administrator.</p>
          <LogoutButton />
        </div>
      </PortalDeskShell>
    )
  }

  return (
    <PortalDeskShell
      badgeTitle="Faculty desk"
      badgeSubtitle="Magwi · teaching"
      headerTitle={title}
      sidebar={(closeMobile) =>
        navPermitted.map((item) => {
          const Icon = item.icon
          const active = tab === item.id
          return (
            <Link
              key={item.id}
              href={`/lecturer-portal?tab=${item.id}`}
              prefetch={false}
              onClick={closeMobile}
              className={[
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors',
                active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
              ].join(' ')}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={1.75} />
              {item.label}
            </Link>
          )
        })
      }
      footer={
        <>
          <LogoutButton className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60" />
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-1 rounded-xl py-2 text-[12px] font-semibold text-slate-500 hover:text-primary"
          >
            Public site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
          </Link>
        </>
      }
    >
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-sm">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed in</p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{faculty?.name}</span> · {faculty?.email}
            </p>
          </div>
          <BarChart3 className="hidden h-10 w-10 text-primary/25 sm:block" aria-hidden strokeWidth={1.25} />
        </header>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <MoodleHubCallout
              headline="Plan, assess, and share resources"
              body="Lesson content, quizzes, forums, grading, rubrics, and rubric feedback are authored inside Moodle."
            />
            <p className="text-sm text-slate-600">
              MUoT keeps SSO entry, profile settings, and programme context here — use Moodle day to day for teaching delivery.
            </p>
          </div>
        )}

        {tab === 'reports' && (
          <EcosystemPlaceholder
            title="Teaching extracts"
            description="Aggregated attainment packs combining Moodle analytics with registrar data arrive here eventually. Use Moodle reporting and central exports meanwhile."
          />
        )}

        {tab === 'messages' && (
          <EcosystemPlaceholder
            title="Messaging"
            description="Prefer Moodle and institutional email for academic dialogue. Lightweight broadcast tooling will converge here."
          />
        )}

        {tab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <PortalPasswordSection />
          </div>
        )}
      </div>
    </PortalDeskShell>
  )
}
