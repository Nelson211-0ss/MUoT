'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardCheck,
  Receipt,
  LineChart,
  Settings,
  ArrowUpRight,
} from 'lucide-react'
import { useMemo } from 'react'
import PortalDeskShell from '@/components/portals/PortalDeskShell'
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

  const title = useMemo(() => {
    const t = navPermitted.find((x) => x.id === tab)
    return t?.label ?? 'Portal'
  }, [tab, navPermitted])

  const loginId = data?.user?.studentLoginNumber
  const badgeSubtitle = loginId ? `Login · ${loginId}` : 'Magwi · registrar'

  if (navPermitted.length === 0) {
    return (
      <PortalDeskShell
        badgeTitle="Student desk"
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
          <p>Your profile is missing updated student navigation scopes. Ask the registrar to sync RBAC seeds.</p>
          <LogoutButton />
        </div>
      </PortalDeskShell>
    )
  }

  return (
    <PortalDeskShell
      badgeTitle="Student desk"
      badgeSubtitle={badgeSubtitle}
      headerTitle={title}
      sidebar={(closeMobile) =>
        navPermitted.map((item) => {
          const Icon = item.icon
          const active = tab === item.id
          return (
            <Link
              key={item.id}
              href={`/student-portal?tab=${item.id}`}
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
              <span className="font-semibold text-slate-900">{data?.user?.name}</span> · {data?.user?.email}
            </p>
            {!loginId ? (
              <p className="mt-2 text-xs text-slate-500">Registrar student number will appear after provisioning.</p>
            ) : null}
          </div>
        </header>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Registrar focus</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{data?.summary?.degreeProgram ?? 'Program pending assignment'}</p>
                <p className="mt-2 text-xs text-slate-600">Admissions dossier timelines; Moodle hosts LMS delivery.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Latest dossier milestone</p>
                <p className="mt-2 text-lg font-bold text-primary">
                  {data?.application ? statusLabel(data.application.status) : 'No dossier synced'}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-800">Reminders</p>
                <p className="mt-2 text-sm font-semibold text-emerald-900">Settle statutory charges before provisional registration locks.</p>
              </div>
            </div>
            <MoodleHubCallout />
          </div>
        )}

        {tab === 'admissions' && (
          <div className="space-y-6">
            {!data?.application ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-600 space-y-2">
                <p>No admissions dossier is linked yet — onboarding might still route through Applicant SSO.</p>
                <Link className="font-semibold text-primary underline underline-offset-2 hover:no-underline" href="/admissions/apply">
                  Applicant workflows
                </Link>
              </div>
            ) : (
              <div className="space-y-5 rounded-2xl border border-slate-100 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Status</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{statusLabel(data.application.status)}</p>
                  </div>
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-bold text-secondary">
                    {data.application.studentNumber ?? 'Awaiting registrar ID'}
                  </span>
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase text-slate-500">Chosen programme</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {data.application.admissionProgram?.name ?? 'Unassigned'}{' '}
                      <span className="block text-xs text-slate-500">{(data.application.admissionProgram?.code ?? '').trim()}</span>
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase text-slate-500">Intake</p>
                    <p className="mt-1 font-semibold">{data.application.admissionIntake?.label ?? 'TBC'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                    <p className="text-xs uppercase text-slate-500">Submitted</p>
                    <p className="mt-1 font-semibold">
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
          <div className="max-w-xl space-y-6">
            <PortalPasswordSection />
          </div>
        )}
      </div>
    </PortalDeskShell>
  )
}
