import Link from 'next/link'
import { BookOpen, ClipboardList, BarChart3, FileDown, Megaphone } from 'lucide-react'
import StudentAssignmentActions from '@/components/StudentAssignmentActions'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function statusStyle(status) {
  if (status === 'GRADED') return 'bg-emerald-100 text-emerald-900'
  if (status === 'SUBMITTED' || status === 'LATE') return 'bg-sky-100 text-sky-800'
  if (status === 'PENDING') return 'bg-amber-100 text-amber-900'
  return 'bg-gray-100 text-gray-700'
}

export default function StudentPortalDashboard({ data }) {
  const { user, summary, courses } = data

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-gray-600 text-sm">
            Signed in as <span className="font-semibold text-primary">{user.email}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Academic profile: {user.name}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3 text-primary mb-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <span className="font-bold">My courses</span>
          </div>
          <p className="text-3xl font-bold text-primary">{summary.courseCount}</p>
          <p className="text-xs text-gray-500 mt-1">Active enrollments</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3 text-primary mb-2">
            <ClipboardList className="w-5 h-5 text-amber-600" />
            <span className="font-bold">To submit</span>
          </div>
          <p className="text-3xl font-bold text-primary">{summary.pendingAssignments}</p>
          <p className="text-xs text-gray-500 mt-1">Assignments without a file</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3 text-primary mb-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span className="font-bold">Average grade</span>
          </div>
          <p className="text-3xl font-bold text-primary">{summary.averageGrade ?? '—'}</p>
          <p className="text-xs text-gray-500 mt-1">From graded items</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-600 rounded-xl border border-dashed border-gray-200 p-8 text-center">
          No courses yet. After your administrator enrolls you, courses and materials will appear here.
        </p>
      ) : (
        <div className="space-y-8">
          {courses.map((course) => (
            <section
              key={course.id}
              className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <div className="bg-primary/5 px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-primary">
                  {course.code} — {course.title}
                </h3>
              </div>

              {(course.announcements?.length ?? 0) > 0 && (
                <div className="px-5 py-4 border-b border-gray-100 bg-amber-50/30">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4 text-secondary" strokeWidth={1.75} aria-hidden />
                    Announcements
                  </p>
                  <ul className="space-y-3">
                    {course.announcements.map((an) => (
                      <li key={an.id} className="text-sm border-l-2 border-secondary pl-3">
                        <span className="font-semibold text-primary">{an.title}</span>
                        <span className="text-gray-400 text-xs ml-2">
                          {an.authorName} · {formatDate(an.createdAt)}
                        </span>
                        <p className="text-gray-600 mt-1 whitespace-pre-wrap text-xs leading-relaxed">{an.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ul className="divide-y divide-gray-100">
                {course.assignments.map((a) => (
                  <li key={a.id} className="px-5 py-4 text-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-medium text-gray-800 block">{a.title}</span>
                        <span className="text-gray-500 text-xs">Due {formatDate(a.dueDate)}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle(a.status)}`}
                      >
                        {a.status}
                        {a.grade != null ? ` · ${a.grade}/${a.maxPoints ?? 100}` : ''}
                      </span>
                    </div>
                    <StudentAssignmentActions assignment={a} />
                  </li>
                ))}
              </ul>

              {(course.materials?.length ?? 0) > 0 && (
                <div className="px-5 py-4 bg-slate-50/90 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <FileDown className="w-4 h-4 text-sky-600" strokeWidth={1.75} aria-hidden />
                    Course materials
                  </p>
                  <ul className="space-y-2">
                    {course.materials.map((m) => (
                      <li key={m.id}>
                        <a
                          href={`/api/portal/materials/${m.id}`}
                          className="text-sm text-blue-600 font-medium hover:text-primary hover:underline inline-flex flex-wrap items-baseline gap-x-1 gap-y-0.5"
                        >
                          {m.title}
                          <span className="text-gray-400 font-normal text-xs">({m.fileName})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        Need help?{' '}
        <Link href="/contact" className="text-blue-600 font-semibold hover:text-blue-800">
          Contact support
        </Link>
      </p>
    </div>
  )
}
