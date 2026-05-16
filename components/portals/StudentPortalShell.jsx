'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardCheck,
  Receipt,
  LineChart,
  Settings,
  PanelLeft,
  PanelRight,
  Menu,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import PortalPasswordSection from '@/components/PortalPasswordSection'
import LogoutButton from '@/components/LogoutButton'
import MoodleHubCallout from '@/components/MoodleHubCallout'
import StudentFeesPanel from '@/components/student-portal/StudentFeesPanel'
import StudentResultsPanel from '@/components/student-portal/StudentResultsPanel'

function statusLabel(raw) {
  const s = String(raw ?? '')
    .replace(/_/g, ' ')
    .toLowerCase()
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

const STUDENT_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'student.nav.dashboard' },
  { id: 'admissions', label: 'Admissions', icon: ClipboardCheck, permission: 'student.nav.admissions' },
  { id: 'fees', label: 'Fees', icon: Receipt, permission: 'student.nav.fees' },
  { id: 'results', label: 'Results', icon: LineChart, permission: 'student.nav.results' },
  { id: 'settings', label: 'Account security', icon: Settings, permission: 'student.nav.settings' },
]

export default function StudentPortalShell({ data, permissionKeys = [] }) {
  const searchParams = useSearchParams()
  const tabRaw = searchParams.get('tab') ?? 'dashboard'

  const navPermitted = useMemo(
    () => STUDENT_NAV.filter((item) => permissionKeys.includes(item.permission)),
    [permissionKeys],
  )

  const tab = navPermitted.some((t) => t.id === tabRaw) ? tabRaw : navPermitted[0]?.id ?? 'dashboard'
  const [mobileNav, setMobileNav] = useState(false)
  const [dockOpen, setDockOpen] = useState(true)

  const title = useMemo(() => {
    const t = navPermitted.find((x) => x.id === tab)
    return t?.label ?? 'Portal'
  }, [tab, navPermitted])

  if (navPermitted.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center text-sm text-gray-700 space-y-4">
        <p>Your profile is missing updated student navigation scopes. Ask the registrar to sync RBAC seeds.</p>
        <LogoutButton />
      </div>
    )
  }

  const loginId = data?.user?.studentLoginNumber

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[60vh]">
      <div className="lg:hidden flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2">
        <span className="text-sm font-semibold text-primary">Student portal</span>
        <button
          type="button"
          className="p-2 rounded-lg border border-gray-200"
          aria-label="Open menu"
          onClick={() => setMobileNav((v) => !v)}
        >
          {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileNav ? (
        <div className="lg:hidden rounded-xl border border-gray-200 bg-white p-3 flex flex-col gap-1">
          {navPermitted.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <Link
                key={item.id}
                href={`/student-portal?tab=${item.id}`}
                onClick={() => setMobileNav(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                  active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            )
          })}
        </div>
      ) : null}

      <aside
        className={`${
          dockOpen ? 'lg:w-56 xl:w-[15rem]' : 'lg:w-14'
        } hidden lg:flex shrink-0 rounded-2xl border border-gray-200 bg-primary text-white flex-col transition-[width]`}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-3 border-b border-white/15">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 px-2">
            {dockOpen ? 'Student' : 'MUT'}
          </span>
          <button
            type="button"
            className="flex p-2 rounded-lg text-white/85 hover:bg-white/10"
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
                href={`/student-portal?tab=${item.id}`}
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
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Workspace</p>
            <h1 className="text-2xl font-bold text-primary mt-1">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Signed in as <span className="font-semibold text-gray-800">{data?.user?.name}</span> · {data?.user?.email}
            </p>
            {loginId ? (
              <p className="mt-2 text-[11px] font-mono text-gray-700">
                Registrar login:&nbsp;<span className="font-semibold">{loginId}</span>
              </p>
            ) : null}
          </div>
        </header>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Registrar focus</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{data?.summary?.degreeProgram ?? 'Program pending assignment'}</p>
                <p className="text-xs text-gray-600 mt-1">Use admissions for dossier timelines; Moodle continues to host LMS delivery.</p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Latest dossier milestone</p>
                <p className="text-lg font-bold text-primary mt-1">
                  {data?.application ? statusLabel(data.application.status) : 'No dossier synced'}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-800">Reminders</p>
                <p className="text-sm font-semibold text-emerald-900 mt-2">Settle statutory charges before provisional registration locks.</p>
              </div>
            </div>
            <MoodleHubCallout />
          </div>
        )}

        {tab === 'admissions' && (
          <div className="space-y-6">
            {!data?.application ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600 space-y-2">
                <p>No admissions dossier is linked yet — onboarding might still route through Applicant SSO.</p>
                <Link className="text-primary font-semibold underline" href="/login?intent=applicant">
                  Applicant workflows
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-gray-400 tracking-[0.2em]">Status</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{statusLabel(data.application.status)}</p>
                  </div>
                  <span className="rounded-full px-4 py-1 text-xs font-bold bg-primary text-white">{data.application.studentNumber ?? 'Awaiting registrar ID'}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase text-gray-500">Chosen programme</p>
                    <p className="font-semibold mt-1 text-gray-900">
                      {data.application.admissionProgram?.name ?? 'Unassigned'}{' '}
                      <span className="text-xs text-gray-500 block">
                        {(data.application.admissionProgram?.code ?? '').trim()}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase text-gray-500">Intake</p>
                    <p className="font-semibold mt-1">{data.application.admissionIntake?.label ?? 'TBC'}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 sm:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Submitted</p>
                    <p className="font-semibold mt-1">
                      {data.application.submittedAt ? new Date(data.application.submittedAt).toLocaleString() : 'Not submitted'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'fees' ? <StudentFeesPanel /> : null}
        {tab === 'results' ? <StudentResultsPanel /> : null}

        {tab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <PortalPasswordSection />
          </div>
        )}
      </section>
    </div>
  )
}
