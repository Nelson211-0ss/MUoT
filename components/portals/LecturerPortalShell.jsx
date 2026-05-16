'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { LayoutDashboard, BarChart3, MessageSquare, Settings, PanelLeft, PanelRight, FileBarChart2 } from 'lucide-react'
import { useMemo, useState } from 'react'
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
  const [dockOpen, setDockOpen] = useState(true)

  if (navPermitted.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center text-sm text-gray-700 space-y-4">
        <p>Your profile is missing lecturer navigation scopes. Contact the registrar or super administrator.</p>
        <LogoutButton />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[60vh]">
      <aside
        className={`${
          dockOpen ? 'lg:w-56 xl:w-[15rem]' : 'lg:w-14'
        } shrink-0 rounded-2xl border border-gray-200 bg-primary text-white flex flex-col transition-[width]`}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-3 border-b border-white/15">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 px-2">
            {dockOpen ? 'Faculty' : 'MUT'}
          </span>
          <button
            type="button"
            className="hidden lg:flex p-2 rounded-lg text-white/85 hover:bg-white/10"
            aria-label={dockOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={() => setDockOpen((o) => !o)}
          >
            {dockOpen ? (
              <PanelLeft className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <PanelRight className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          {navPermitted.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <Link
                key={item.id}
                href={`/lecturer-portal?tab=${item.id}`}
                title={!dockOpen ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active ? 'bg-white text-primary shadow-sm' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
                {dockOpen ? <span className="truncate">{item.label}</span> : null}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto p-3 border-t border-white/10">
          <LogoutButton className="w-full justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20" />
        </div>
      </aside>

      <section className="flex-1 min-w-0 rounded-2xl border border-gray-100 bg-white p-5 sm:p-8 shadow-sm">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Lecturer desk</p>
            <h1 className="text-2xl font-bold text-primary mt-1 capitalize">{tab.replace('-', ' ')}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {faculty?.name} · {faculty?.email}
            </p>
          </div>
          <BarChart3 className="hidden sm:block w-10 h-10 text-primary/30" aria-hidden />
        </header>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <MoodleHubCallout
              headline="Plan, assess, and share resources"
              body="Lesson content, quizzes, forums, grading, rubrics, and rubric feedback are authored inside Moodle."
            />
            <p className="text-sm text-gray-600">
              MUoT web keeps SSO entry, HR-light profile settings, and high-level approvals. Dive into Moodle for day-to-day teaching.
            </p>
          </div>
        )}

        {tab === 'reports' && (
          <EcosystemPlaceholder
            title="Teaching extracts"
            description="Aggregated attainment packs that combine Moodle analytics with registrar data land here eventually. Today, use Moodle reporting tools plus programme exports managed centrally."
          />
        )}

        {tab === 'messages' && (
          <EcosystemPlaceholder
            title="Messaging"
            description="Most academic conversations should stay in Moodle & institutional email. Lightweight broadcast tooling will converge here."
          />
        )}

        {tab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <PortalPasswordSection />
          </div>
        )}
      </section>
    </div>
  )
}
