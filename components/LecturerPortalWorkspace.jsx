'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, Users, Megaphone, ClipboardPlus, ClipboardList } from 'lucide-react'
import LecturerCourseMaterialsPanel from '@/components/LecturerCourseMaterialsPanel'

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export default function LecturerPortalWorkspace({ courses }) {
  const router = useRouter()
  const [toast, setToast] = useState(null)

  function flash(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  async function postAnnouncement(courseId, e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const title = fd.get('title')?.trim()
    const body = fd.get('body')?.trim()
    if (!title || !body) return flash('Fill title and message', false)
    const res = await fetch('/api/lecturer/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, title, body }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return flash(data.error || 'Failed', false)
    e.currentTarget.reset()
    flash('Announcement posted')
    router.refresh()
  }

  async function deleteAnnouncement(id) {
    const res = await fetch(`/api/lecturer/announcements/${id}`, { method: 'DELETE' })
    if (!res.ok) return flash('Could not delete', false)
    flash('Removed')
    router.refresh()
  }

  async function createAssignment(courseId, e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const title = fd.get('title')?.trim()
    const description = fd.get('description')?.trim() || null
    const dueDate = fd.get('dueDate')
    const maxPoints = parseInt(String(fd.get('maxPoints') || '100'), 10)
    if (!title || !dueDate) return flash('Title and due date required', false)
    const res = await fetch('/api/lecturer/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        title,
        description,
        maxPoints: Number.isFinite(maxPoints) ? maxPoints : 100,
        dueDate: new Date(dueDate).toISOString(),
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return flash(data.error || 'Failed', false)
    e.currentTarget.reset()
    flash('Assignment created')
    router.refresh()
  }

  async function saveGrade(progressId, grade, feedback, maxPoints) {
    const g = parseInt(String(grade), 10)
    if (!Number.isFinite(g) || g < 0 || g > maxPoints) {
      return flash(`Grade must be 0–${maxPoints}`, false)
    }
    const res = await fetch('/api/lecturer/grades', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progressId, grade: g, feedback }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return flash(data.error || 'Grade failed', false)
    flash('Grade saved')
    router.refresh()
  }

  const materialsOnly = courses.map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    materials: c.materials,
  }))

  return (
    <div className="space-y-8">
      {toast && (
        <p
          className={`text-sm rounded-md px-3 py-2 ${toast.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}
        >
          {toast.msg}
        </p>
      )}

      <LecturerCourseMaterialsPanel courses={materialsOnly} />

      {courses.length === 0 ? null : (
        <div className="space-y-10">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <ClipboardList className="w-5 h-5" strokeWidth={1.75} aria-hidden />
            Teaching desk
          </h2>
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white"
            >
              <div className="bg-primary text-white px-5 py-3">
                <h3 className="font-bold">
                  {course.code} · {course.title}
                </h3>
              </div>

              <div className="p-5 space-y-8 border-t border-gray-100">
                <section>
                  <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary" strokeWidth={1.75} />
                    Class roster ({course.roster.length})
                  </h4>
                  {course.roster.length === 0 ? (
                    <p className="text-sm text-gray-500">No students enrolled yet.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                          <tr>
                            <th className="px-3 py-2 font-semibold">Name</th>
                            <th className="px-3 py-2 font-semibold">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {course.roster.map((s) => (
                            <tr key={s.id}>
                              <td className="px-3 py-2 font-medium text-gray-800">{s.name}</td>
                              <td className="px-3 py-2 text-gray-600">{s.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-secondary" strokeWidth={1.75} />
                    Announcements
                  </h4>
                  <ul className="space-y-3 mb-4">
                    {(course.announcements || []).length === 0 ? (
                      <li className="text-sm text-gray-500">No announcements yet.</li>
                    ) : (
                      course.announcements.map((an) => (
                        <li
                          key={an.id}
                          className="text-sm bg-slate-50 rounded-lg px-3 py-2 flex flex-wrap gap-2 justify-between items-start"
                        >
                          <div>
                            <span className="font-semibold text-primary">{an.title}</span>
                            <span className="text-gray-400 text-xs ml-2">{fmtDate(an.createdAt)}</span>
                            <p className="text-gray-600 text-xs mt-1 whitespace-pre-wrap">{an.body}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteAnnouncement(an.id)}
                            className="text-red-600 text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                  <form
                    className="grid sm:grid-cols-2 gap-3 bg-primary/5 p-4 rounded-lg"
                    onSubmit={(ev) => postAnnouncement(course.id, ev)}
                  >
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-gray-600 block mb-1">Title</label>
                      <input name="title" className="w-full border rounded-md p-2 text-sm" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-gray-600 block mb-1">Message</label>
                      <textarea name="body" rows={3} className="w-full border rounded-md p-2 text-sm" required />
                    </div>
                    <button
                      type="submit"
                      className="sm:col-span-2 bg-secondary text-primary font-bold py-2 rounded-md text-sm hover:brightness-95"
                    >
                      Post announcement
                    </button>
                  </form>
                </section>

                <section className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                    <ClipboardPlus className="w-4 h-4 text-secondary" strokeWidth={1.75} />
                    Create assignment
                  </h4>
                  <form
                    className="grid sm:grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-lg"
                    onSubmit={(ev) => createAssignment(course.id, ev)}
                  >
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-gray-600 block mb-1">Title</label>
                      <input name="title" className="w-full border rounded-md p-2" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-gray-600 block mb-1">
                        Instructions (optional)
                      </label>
                      <textarea name="description" rows={2} className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Due</label>
                      <input name="dueDate" type="datetime-local" className="w-full border rounded-md p-2" required />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Points</label>
                      <input name="maxPoints" type="number" min={1} max={500} defaultValue={100} className="w-full border rounded-md p-2" />
                    </div>
                    <button
                      type="submit"
                      className="sm:col-span-2 bg-primary text-white font-bold py-2 rounded-md hover:opacity-90"
                    >
                      Add assignment for all enrolled students
                    </button>
                  </form>
                </section>

                {(course.assignments || []).length > 0 && (
                  <section className="border-t border-gray-100 pt-6 space-y-6">
                    <h4 className="text-sm font-bold text-primary">Assignments & grading</h4>
                    {course.assignments.map((asn) => (
                      <div key={asn.id} className="border border-gray-100 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-3 py-2 text-sm font-semibold text-primary">
                          {asn.title}{' '}
                          <span className="font-normal text-gray-500">
                            · due {fmtDate(asn.dueDate)} · {asn.maxPoints} pts
                          </span>
                        </div>
                        {asn.description ? (
                          <p className="text-xs text-gray-600 px-3 py-2 border-b whitespace-pre-wrap">{asn.description}</p>
                        ) : null}
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-white text-gray-500 text-left uppercase">
                              <tr>
                                <th className="px-2 py-2">Student</th>
                                <th className="px-2 py-2">Submission</th>
                                <th className="px-2 py-2">Status</th>
                                <th className="px-2 py-2">Grade</th>
                                <th className="px-2 py-2">Feedback</th>
                                <th className="px-2 py-2" />
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {asn.progress.map((p) => (
                                <GradeRow
                                  key={p.progressId}
                                  asn={asn}
                                  p={p}
                                  onSave={(gradeVal, fb) => saveGrade(p.progressId, gradeVal, fb, asn.maxPoints)}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </section>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GradeRow({ asn, p, onSave }) {
  const [grade, setGrade] = useState(p.grade != null ? String(p.grade) : '')
  const [feedback, setFeedback] = useState(p.feedback || '')
  return (
    <tr>
      <td className="px-2 py-2">
        <div className="font-medium text-gray-800">{p.studentName}</div>
        <div className="text-gray-500">{p.studentEmail}</div>
      </td>
      <td className="px-2 py-2">
        {p.hasSubmission ? (
          <div>
            <a
              href={`/api/lecturer/submissions/${p.progressId}/file`}
              className="text-blue-600 font-semibold underline"
              target="_blank"
              rel="noreferrer"
            >
              {p.submissionFileName || 'Download'}
            </a>
            {p.submittedAt && <div className="text-gray-400">{fmtDate(p.submittedAt)}</div>}
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
      <td className="px-2 py-2">{p.status}</td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={0}
          max={asn.maxPoints}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-16 border rounded px-1 py-0.5"
        />
        <span className="text-gray-400"> /{asn.maxPoints}</span>
      </td>
      <td className="px-2 py-2">
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-40 border rounded px-1 py-0.5 max-w-[12rem]"
          placeholder="Feedback"
        />
      </td>
      <td className="px-2 py-2">
        <button
          type="button"
          onClick={() => onSave(grade, feedback)}
          className="bg-secondary text-primary px-2 py-1 rounded font-bold text-[10px] hover:brightness-95"
        >
          Save
        </button>
      </td>
    </tr>
  )
}
