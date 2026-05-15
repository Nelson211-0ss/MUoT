import Link from 'next/link'
import { BookOpen, ClipboardList, BarChart3 } from 'lucide-react'

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

export default function StudentPortalDashboard({ data }) {
  const { user, summary, courses } = data

  return (
    <div className="space-y-10">
      <p className="text-gray-600">
        Signed in as <span className="font-semibold text-primary">{user.email}</span>
      </p>

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
            <span className="font-bold">Pending work</span>
          </div>
          <p className="text-3xl font-bold text-primary">{summary.pendingAssignments}</p>
          <p className="text-xs text-gray-500 mt-1">Assignments to submit</p>
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
          No courses yet. After admission, your enrollments will appear here.
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
              <ul className="divide-y divide-gray-100">
                {course.assignments.map((a) => (
                  <li key={a.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-gray-800">{a.title}</span>
                    <span className="text-gray-500">Due {formatDate(a.dueDate)}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        a.status === 'SUBMITTED'
                          ? 'bg-sky-100 text-sky-800'
                          : a.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {a.status}
                      {a.grade != null ? ` · ${a.grade}%` : ''}
                    </span>
                  </li>
                ))}
              </ul>
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
