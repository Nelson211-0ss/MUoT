'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  UsersRound,
  ClipboardList,
  IdCard,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'people', label: 'People & courses', icon: UsersRound },
  { id: 'enrollments', label: 'Enrollments', icon: ClipboardList },
  { id: 'directory', label: 'Account directory', icon: IdCard },
]

export default function AdminDashboard({ users, courses, enrollments = [] }) {
  const router = useRouter()
  const [msg, setMsg] = useState(null)
  const [section, setSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const lecturers = users.filter((u) => u.role === 'LECTURER')
  const students = users.filter((u) => u.role === 'STUDENT')
  const adminCount = users.filter((u) => u.role === 'ADMIN').length

  function flash(text, ok) {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 4500)
  }

  async function createUser(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return flash(data.error || 'Failed', false)
    e.currentTarget.reset()
    flash('User created')
    router.refresh()
  }

  async function setLecturer(courseId, lecturerIdRaw) {
    const lecturerId = lecturerIdRaw === '' ? null : lecturerIdRaw
    const res = await fetch(`/api/admin/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lecturerId }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return flash(data.error || 'Update failed', false)
    flash('Course lecturer updated')
    router.refresh()
  }

  async function enroll(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const userId = fd.get('userId')
    const courseId = fd.get('courseId')
    const res = await fetch('/api/admin/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return flash(data.error || 'Enrollment failed', false)
    flash('Student enrolled')
    router.refresh()
  }

  async function drop(userId, courseId) {
    const res = await fetch(`/api/admin/enrollments?userId=${userId}&courseId=${courseId}`, {
      method: 'DELETE',
    })
    if (!res.ok) return flash('Drop failed', false)
    flash('Enrollment removed')
    router.refresh()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden min-h-[min(70vh,900px)]">
      <div className="lg:hidden border-b border-gray-200 bg-slate-50 p-3">
        <label className="sr-only" htmlFor="admin-section-mobile">
          Admin section
        </label>
        <select
          id="admin-section-mobile"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 bg-white"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          {SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <aside
        className={`${
          sidebarOpen ? 'lg:w-60 xl:w-64' : 'lg:w-[4.25rem]'
        } shrink-0 bg-primary text-white flex flex-col transition-[width] duration-200 ease-out`}
      >
        <div className="hidden lg:flex items-center justify-between gap-2 px-3 py-4 border-b border-white/10">
          {sidebarOpen ? (
            <p className="text-xs font-bold uppercase tracking-wider text-white/90 pl-1">Admin</p>
          ) : (
            <span className="sr-only">Admin menu</span>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <PanelLeft className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <nav className="hidden lg:flex flex-col gap-1 p-2 flex-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            const active = section === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                title={!sidebarOpen ? s.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                  active ? 'bg-white text-primary shadow-sm' : 'text-white/85 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} aria-hidden />
                {sidebarOpen ? <span className="truncate">{s.label}</span> : null}
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 bg-slate-50/80">
        <div className="p-5 sm:p-8 max-w-4xl mx-auto space-y-8">
          {msg && (
            <p
              className={`text-sm px-4 py-3 rounded-xl ${
                msg.ok
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                  : 'bg-red-50 text-red-800 border border-red-100'
              }`}
            >
              {msg.text}
            </p>
          )}

          {section === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-bold text-primary text-xl">Overview</h2>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  Lecturers and official student accounts are provisioned here. Public registration remains student-only.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Users</p>
                  <p className="text-3xl font-bold text-primary mt-2">{users.length}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Students</p>
                  <p className="text-3xl font-bold text-primary mt-2">{students.length}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lecturers</p>
                  <p className="text-3xl font-bold text-primary mt-2">{lecturers.length}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Courses</p>
                  <p className="text-3xl font-bold text-primary mt-2">{courses.length}</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm flex flex-wrap gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Admins:</span> {adminCount}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Active enrollments:</span> {enrollments.length}
                </div>
              </div>
            </div>
          )}

          {section === 'people' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-bold text-primary text-xl">People & courses</h2>
                <p className="text-sm text-gray-600 mt-1">Create accounts and assign teaching staff to modules.</p>
              </div>

              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary mb-4">Create user (lecturer or student)</h3>
                <form onSubmit={createUser} className="grid sm:grid-cols-2 gap-3 max-w-2xl text-sm">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Full name</label>
                    <input name="name" required minLength={2} className="w-full border rounded-md p-2.5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
                    <input name="email" type="email" required className="w-full border rounded-md p-2.5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Temporary password</label>
                    <input name="password" type="password" required minLength={8} className="w-full border rounded-md p-2.5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Role</label>
                    <select name="role" className="w-full border rounded-md p-2.5" required defaultValue={''}>
                      <option value="" disabled>
                        Select…
                      </option>
                      <option value="STUDENT">Student</option>
                      <option value="LECTURER">Lecturer</option>
                    </select>
                  </div>
                  <button type="submit" className="sm:col-span-2 bg-primary text-white font-bold py-2.5 rounded-md hover:opacity-90">
                    Create account
                  </button>
                </form>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary mb-4">Courses & lecturers</h3>
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-3 py-2">Course</th>
                        <th className="px-3 py-2">Enrolled</th>
                        <th className="px-3 py-2">Assign lecturer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {courses.map((c) => (
                        <tr key={c.id}>
                          <td className="px-3 py-2 font-medium">
                            {c.code} — {c.title}
                          </td>
                          <td className="px-3 py-2 text-gray-600">{c._count.enrollments}</td>
                          <td className="px-3 py-2">
                            <select
                              defaultValue={c.lecturerId ?? ''}
                              onChange={(e) => setLecturer(c.id, e.target.value)}
                              className="border rounded-md px-2 py-1.5 text-xs max-w-[220px]"
                            >
                              <option value="">No lecturer assigned</option>
                              {lecturers.map((l) => (
                                <option key={l.id} value={l.id}>
                                  {l.name} ({l.email})
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {section === 'enrollments' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-bold text-primary text-xl">Enrollments</h2>
                <p className="text-sm text-gray-600 mt-1">Add or remove student–course links.</p>
              </div>

              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary mb-4">Enroll student in course</h3>
                <form onSubmit={enroll} className="flex flex-wrap gap-3 items-end text-sm">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Student</label>
                    <select name="userId" className="border rounded-md px-2 py-2 min-w-[200px]" required defaultValue="">
                      <option value="" disabled>
                        Select student
                      </option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Course</label>
                    <select name="courseId" className="border rounded-md px-2 py-2 min-w-[240px]" required defaultValue="">
                      <option value="" disabled>
                        Select course
                      </option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} — {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="bg-secondary text-primary font-bold px-5 py-2 rounded-md hover:brightness-95">
                    Enroll
                  </button>
                </form>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary mb-4">Active enrollments</h3>
                <div className="overflow-x-auto border border-gray-100 rounded-lg max-h-[340px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0 text-left uppercase text-gray-500">
                      <tr>
                        <th className="px-2 py-2">Student</th>
                        <th className="px-2 py-2">Course</th>
                        <th className="px-2 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {enrollments.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-2 py-4 text-center text-gray-500">
                            No enrollments yet.
                          </td>
                        </tr>
                      ) : (
                        enrollments.map((en) => (
                          <tr key={en.id}>
                            <td className="px-2 py-1.5">
                              <div className="font-medium text-gray-800">{en.user.name}</div>
                              <div className="text-gray-500">{en.user.email}</div>
                            </td>
                            <td className="px-2 py-1.5">
                              {en.course.code} — {en.course.title}
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <button
                                type="button"
                                onClick={() => drop(en.user.id, en.course.id)}
                                className="text-red-600 font-semibold hover:underline"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {section === 'directory' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-bold text-primary text-xl">Account directory</h2>
                <p className="text-sm text-gray-600 mt-1">All users in the system (read-only).</p>
              </div>
              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="overflow-x-auto border border-gray-100 rounded-lg max-h-[min(60vh,520px)] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0 text-left uppercase text-gray-500">
                      <tr>
                        <th className="px-2 py-2">Email</th>
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="px-2 py-1.5 text-gray-800">{u.email}</td>
                          <td className="px-2 py-1.5">{u.name}</td>
                          <td className="px-2 py-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 font-semibold ${
                                u.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-900'
                                  : u.role === 'LECTURER'
                                    ? 'bg-sky-100 text-sky-900'
                                    : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
