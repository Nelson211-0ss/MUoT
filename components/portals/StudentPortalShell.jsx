'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Bell,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Award,
  CreditCard,
  GraduationCap,
  MessageSquare,
  Settings,
  CalendarDays,
  Menu,
  X,
  PanelLeft,
  PanelRight,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import StudentPortalDashboard from '@/components/StudentPortalDashboard'
import PortalPasswordSection from '@/components/PortalPasswordSection'
import StudentAssignmentActions from '@/components/StudentAssignmentActions'
import LogoutButton from '@/components/LogoutButton'
import EcosystemPlaceholder from '@/components/portals/EcosystemPlaceholder'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'courses', label: 'My courses', icon: BookOpen },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'results', label: 'Results', icon: Award },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'certificates', label: 'Certificates', icon: GraduationCap },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function flattenAssignments(data) {
  const out = []
  for (const c of data.courses) {
    for (const a of c.assignments) {
      out.push({
        ...a,
        courseCode: c.code,
        courseTitle: c.title,
      })
    }
  }
  out.sort((x, y) => new Date(x.dueDate) - new Date(y.dueDate))
  return out
}

function CoursesGrid({ courses }) {
  if (courses.length === 0) {
    return (
      <p className="text-gray-600 rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm">
        You are not enrolled yet. Admissions or your registrar will enrol you shortly.
      </p>
    )
  }
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {courses.map((c) => (
        <div
          key={c.id}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <h3 className="font-bold text-primary">
            {c.code} — {c.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {c.assignments?.length ?? 0} assessments · {(c.materials?.length ?? 0) || 0} materials
          </p>
          <Link
            href={`/courses#${c.id}`}
            className="inline-block mt-4 text-xs font-semibold text-blue-600 hover:underline"
          >
            Browse public catalogue · {c.code}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default function StudentPortalShell({ data }) {
  const searchParams = useSearchParams()
  const tabRaw = searchParams.get('tab') ?? 'dashboard'
  const tab = TABS.some((t) => t.id === tabRaw) ? tabRaw : 'dashboard'
  const [mobileNav, setMobileNav] = useState(false)
  const [dockOpen, setDockOpen] = useState(true)

  const flatAssignments = useMemo(() => flattenAssignments(data), [data])

  const title = useMemo(() => {
    const t = TABS.find((x) => x.id === tab)
    return t?.label ?? 'Portal'
  }, [tab])

  const upcomingPlaceholder = ['Live sessions & Google Meet hooks', 'Integrated timetable sync'].join(' • ')

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[60vh]">
      <aside
        className={`${
          dockOpen ? 'lg:w-56 xl:w-[15rem]' : 'lg:w-14'
        } shrink-0 rounded-2xl border border-gray-200 bg-primary text-white flex flex-row lg:flex-col overflow-hidden transition-[width]`}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-3 border-b border-white/15 shrink-0 w-full lg:w-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 hidden lg:inline text-white/80">
            {dockOpen ? 'Study' : 'MUT'}
          </span>
          <button
            type="button"
            className="hidden lg:flex p-2 rounded-lg text-white/85 hover:bg-white/10 ml-auto"
            onClick={() => setDockOpen((o) => !o)}
            aria-label={dockOpen ? 'Collapse menu' : 'Expand menu'}
          >
            {dockOpen ? (
              <PanelLeft className="w-5 h-5" strokeWidth={1.75} aria-hidden />
            ) : (
              <PanelRight className="w-5 h-5" strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>

        <nav className="flex lg:flex-col gap-1 p-2 overflow-x-auto lg:overflow-visible flex-1">
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <Link
                key={item.id}
                href={`/student-portal?tab=${item.id}`}
                prefetch={false}
                title={!dockOpen ? item.label : undefined}
                className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-3 text-xs font-semibold transition-colors shrink-0 ${
                  active ? 'bg-white text-primary shadow' : 'text-white/88 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} aria-hidden />
                {dockOpen ? <span>{item.label}</span> : null}
              </Link>
            )
          })}
        </nav>

        <div className="lg:hidden shrink-0 p-2">
          <button
            type="button"
            aria-label={mobileNav ? 'Close menu' : 'Open menu'}
            className="p-3 rounded-xl bg-secondary text-primary"
            onClick={() => setMobileNav((x) => !x)}
          >
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {mobileNav ? (
        <div className="lg:hidden rounded-2xl border border-gray-200 bg-slate-50 p-4 space-y-1">
          {TABS.map((item) => {
            const active = tab === item.id
            return (
              <Link
                key={item.id}
                href={`/student-portal?tab=${item.id}`}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold ${active ? 'bg-primary text-white' : 'text-gray-700'}`}
                onClick={() => setMobileNav(false)}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      ) : null}

      <div className="flex-1 min-w-0 space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold">Student workspace</p>
            <h1 className="text-2xl font-bold text-primary mt-1">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Signed in as <span className="font-semibold text-gray-800">{data.user.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:border-primary/40 bg-white shadow-sm"
              disabled
              title="Campus announcements & LMS alerts roll out soon"
            >
              <Bell className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
              Notifications (soon)
            </button>
            <LogoutButton />
          </div>
        </div>

        {tab === 'dashboard' && (
          <>
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                  <Award className="w-4 h-4 text-emerald-600" aria-hidden strokeWidth={1.75} />
                  Academic average
                </p>
                <p className="text-3xl font-bold text-primary mt-2">{data.summary.averageGrade ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-1">Rolling average from graded work</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                  <ClipboardList className="w-4 h-4 text-amber-600" aria-hidden strokeWidth={1.75} />
                  Assignments awaiting upload
                </p>
                <p className="text-3xl font-bold text-primary mt-2">{data.summary.pendingAssignments}</p>
                <p className="text-xs text-gray-500 mt-1">No file submitted yet</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
                <p className="text-xs font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide mb-3">
                  <CalendarDays className="w-4 h-4 text-sky-600" aria-hidden strokeWidth={1.75} />
                  Upcoming (preview)
                </p>
                <p className="text-sm text-gray-600 leading-snug">{upcomingPlaceholder}</p>
              </div>
            </div>
            <StudentPortalDashboard data={data} />
          </>
        )}

        {tab === 'courses' && (
          <>
            <EcosystemPlaceholder
              title="Course hub"
              description="Every active enrollment appears below. Dedicated video modules, live attendance, and discussion boards connect here in upcoming releases alongside the LMS sync."
              footnote="Today's build keeps materials & assignments synced with lecturers."
            />
            <CoursesGrid courses={data.courses} />
          </>
        )}

        {tab === 'assignments' && (
          <div className="space-y-4">
            <EcosystemPlaceholder
              title="Assignment tracker"
              description="Submit files, preview feedback, and open downloads for every enrollment from one command center."
              footnote="Quizzes/exams parity routes through this surface next."
            />
            <div className="space-y-4">
              {flatAssignments.length === 0 ? (
                <p className="text-gray-600 text-center border border-dashed rounded-xl py-12 text-sm">
                  Nothing scheduled yet—check My courses.
                </p>
              ) : (
                flatAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-sm space-y-2"
                  >
                    <div className="flex flex-wrap justify-between gap-2 items-start">
                      <div>
                        <p className="text-[11px] font-semibold text-secondary">{a.courseCode}</p>
                        <p className="font-semibold text-primary">{a.title}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-slate-50 text-gray-700 font-semibold">{a.status}</span>
                    </div>
                    <StudentAssignmentActions assignment={a} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'results' && (
          <div className="space-y-4">
            <EcosystemPlaceholder
              title="Official results & transcripts"
              description="Transcript exports, moderation queues, and exam boards release through this locker once registrar workflows digitise completely."
              footnote="Graded LMS items populate automatically."
            />
            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left uppercase text-[11px] text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {flatAssignments.filter((a) => a.grade != null).length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-gray-500" colSpan={3}>
                        No graded results yet.
                      </td>
                    </tr>
                  ) : (
                    flatAssignments
                      .filter((a) => a.grade != null)
                      .map((a) => (
                        <tr key={a.id}>
                          <td className="px-4 py-2 font-medium">{a.courseCode}</td>
                          <td className="px-4 py-2">{a.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="font-semibold text-primary">{a.grade}</span>
                            <span className="text-gray-400"> /{a.maxPoints ?? 100}</span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'payments' && (
          <EcosystemPlaceholder
            title="Tuition & fees"
            description="Stripe · Flutterwave · PayPal · MTN/Airtel money rails orchestrate approvals, disbursements, and receipts from one finance desk."
            footnote="Integrated ledger + webhook reconciliation ships with the commerce milestone."
          />
        )}

        {tab === 'certificates' && (
          <EcosystemPlaceholder
            title="Certificates & attestations"
            description="NFT-grade PDF attestations plus verification portals so employers trust your credentials instantly."
          />
        )}

        {tab === 'messages' && (
          <EcosystemPlaceholder
            title="Messages & counselling"
            description="Secure chat bridging faculty office hours and student success coaching with audit trails aligned to GDPR-style privacy."
          />
        )}

        {tab === 'settings' && (
          <div className="max-w-xl space-y-4">
            <p className="text-sm text-gray-600">
              Security preferences tie into the identity service so JWT sessions, SSO, and device trust stay cohesive.
            </p>
            <PortalPasswordSection />
          </div>
        )}
      </div>
    </div>
  )
}
