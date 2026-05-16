'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
  Video,
  FileBarChart2,
  Settings,
  PanelLeft,
  PanelRight,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import LecturerPortalWorkspace from '@/components/LecturerPortalWorkspace'
import LecturerCourseMaterialsPanel from '@/components/LecturerCourseMaterialsPanel'
import EcosystemPlaceholder from '@/components/portals/EcosystemPlaceholder'
import PortalPasswordSection from '@/components/PortalPasswordSection'
import LogoutButton from '@/components/LogoutButton'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'courses', label: 'My courses', icon: BookOpen },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'grades', label: 'Grades', icon: BarChart3 },
  { id: 'live', label: 'Live classes', icon: Video },
  { id: 'reports', label: 'Reports', icon: FileBarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function LecturerPortalShell({ courses, faculty }) {
  const searchParams = useSearchParams()
  const raw = searchParams.get('tab') ?? 'dashboard'
  const tab = TABS.some((t) => t.id === raw) ? raw : 'dashboard'
  const [dockOpen, setDockOpen] = useState(true)

  const materialsOnly = useMemo(
    () =>
      courses.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        materials: c.materials,
      })),
    [courses],
  )

  const roster = useMemo(() => {
    const map = new Map()
    for (const c of courses) {
      for (const row of c.roster ?? []) {
        if (!map.has(row.email)) map.set(row.email, row)
      }
    }
    return [...map.values()]
  }, [courses])

  const rosterCount = roster.length
  const courseCount = courses.length

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
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <Link
                key={item.id}
                href={`/lecturer-portal?tab=${item.id}`}
                prefetch={false}
                title={!dockOpen ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold transition-colors ${
                  active ? 'bg-white text-primary shadow-sm' : 'text-white/88 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden strokeWidth={1.75} />
                {dockOpen ? <span>{item.label}</span> : null}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <p className="text-xs uppercase font-semibold text-secondary tracking-wide">Lecturer workspace</p>
            <h2 className="text-2xl font-bold text-primary mt-1">
              {TABS.find((t) => t.id === tab)?.label ?? 'Teaching'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {faculty ? (
                <>
                  <span className="font-semibold text-gray-800">{faculty.name}</span>
                  <span className="mx-2">·</span>
                  <span className="font-medium text-primary">{faculty.email}</span>
                </>
              ) : null}
            </p>
          </div>
          <LogoutButton />
        </div>

        {tab === 'dashboard' && (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <p className="text-xs uppercase text-gray-500 font-semibold">Courses instructed</p>
                <p className="text-3xl font-bold text-primary">{courseCount}</p>
              </div>
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <p className="text-xs uppercase text-gray-500 font-semibold">Distinct students</p>
                <p className="text-3xl font-bold text-primary">{rosterCount}</p>
              </div>
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <p className="text-xs uppercase text-gray-500 font-semibold">Next wave</p>
                <p className="text-sm text-gray-600 leading-snug">Live sessions, attendance ingest, LMS analytics.</p>
              </div>
            </div>
            <LecturerPortalWorkspace courses={courses} />
          </>
        )}

        {tab === 'courses' && (
          <div className="space-y-4">
            <EcosystemPlaceholder
              title="Authoring & modules"
              description="Soon: drag-and-drop learning paths, chunked video timelines, formative quizzes—all versioned beside your Magwi course codes."
              footnote="Uploads propagate instantly to enrolled students via the catalogue."
            />
            <LecturerCourseMaterialsPanel courses={materialsOnly} />
          </div>
        )}

        {tab === 'students' && (
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roster.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                      Roster fills automatically once students are enrolled via admin/portals.
                    </td>
                  </tr>
                ) : (
                  roster.map((r) => (
                    <tr key={r.email}>
                      <td className="px-4 py-2 font-medium">{r.name}</td>
                      <td className="px-4 py-2">{r.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {(tab === 'assignments' || tab === 'grades') && (
          <EcosystemPlaceholder
            title="Assignments & mastery insights"
            description="Unified authoring, moderated exams, and cohort analytics converge here—the teaching cockpit on Dashboard already exposes live grading workflows."
          />
        )}

        {tab === 'live' && (
          <EcosystemPlaceholder
            title="Live & hybrid classes"
            description="Meeting bridges, breakout tracking, attendance marks, and policy-controlled recordings—all tied to SSO."
          />
        )}

        {tab === 'reports' && (
          <EcosystemPlaceholder
            title="Faculty analytics"
            description="Downloadable attainment packs plus predictive risk scores for departmental leads."
          />
        )}

        {tab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <p className="text-sm text-gray-600">
              Notification routing & delegation preferences migrate here when SSO depth ships.
            </p>
            <PortalPasswordSection />
          </div>
        )}
      </div>
    </div>
  )
}
