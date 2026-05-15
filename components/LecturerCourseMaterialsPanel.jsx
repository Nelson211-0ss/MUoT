'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, Upload } from 'lucide-react'

function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

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

export default function LecturerCourseMaterialsPanel({ courses }) {
  const router = useRouter()
  const [status, setStatus] = useState(null)
  const [pendingCourseId, setPendingCourseId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  if (!courses.length) {
    return (
      <p className="text-gray-600 rounded-xl border border-dashed border-gray-200 p-8 text-center">
        No courses assigned to you yet. Contact an administrator to link your lecturer account to courses.
      </p>
    )
  }

  async function handleUpload(e, courseId) {
    e.preventDefault()
    setStatus(null)
    const form = e.currentTarget
    setPendingCourseId(courseId)
    try {
      const fd = new FormData(form)
      fd.set('courseId', courseId)
      const res = await fetch('/api/lecturer/materials', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Upload failed.' })
        return
      }
      setStatus({ type: 'success', message: 'File uploaded successfully.' })
      form.reset()
      router.refresh()
    } catch {
      setStatus({ type: 'error', message: 'Network error.' })
    } finally {
      setPendingCourseId(null)
    }
  }

  async function handleDelete(materialId) {
    setStatus(null)
    setDeletingId(materialId)
    try {
      const res = await fetch(`/api/lecturer/materials/${materialId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Delete failed.' })
        return
      }
      setStatus({ type: 'success', message: 'Material removed.' })
      router.refresh()
    } catch {
      setStatus({ type: 'error', message: 'Network error.' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {status && (
        <p
          className={`text-sm rounded-md px-3 py-2 ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {status.message}
        </p>
      )}
      {courses.map((course) => (
        <section
          key={course.id}
          className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <div className="bg-primary/5 px-5 py-4 border-b border-gray-100 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-primary">
                {course.code} — {course.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Students enrolled in this course can download materials.</p>
            </div>
          </div>

          <div className="p-5 border-b border-gray-100 bg-slate-50/50">
            <h4 className="text-sm font-semibold text-primary mb-3 inline-flex items-center gap-2">
              <Upload className="w-4 h-4 text-secondary" aria-hidden strokeWidth={1.75} />
              Upload material
            </h4>
            <form className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-end" onSubmit={(ev) => handleUpload(ev, course.id)}>
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs font-medium text-gray-500 block mb-1">Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Week 3 lecture slides"
                  className="w-full border border-gray-200 p-2.5 rounded-md text-sm focus:outline-none focus:border-primary"
                  disabled={pendingCourseId === course.id}
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs font-medium text-gray-500 block mb-1">File</label>
                <input
                  name="file"
                  type="file"
                  required
                  className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:text-xs file:font-semibold"
                  disabled={pendingCourseId === course.id}
                />
              </div>
              <button
                type="submit"
                disabled={pendingCourseId === course.id}
                className="bg-secondary text-primary px-6 py-2.5 rounded-md text-sm font-bold hover:brightness-95 transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {pendingCourseId === course.id ? 'Uploading…' : 'Upload'}
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">PDF, DOCX, PPTX, ZIP, etc. Maximum 12 MB.</p>
          </div>

          <ul className="divide-y divide-gray-100">
            {course.materials.length === 0 ? (
              <li className="px-5 py-6 text-sm text-gray-500 text-center">No materials uploaded yet.</li>
            ) : (
              course.materials.map((m) => (
                <li key={m.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <span className="font-medium text-gray-800">{m.title}</span>
                    <span className="text-gray-400 mx-2">·</span>
                    <span className="text-gray-500 truncate">{m.fileName}</span>
                    <span className="text-gray-400 text-xs block mt-0.5">
                      {formatBytes(m.sizeBytes)} · {formatDate(m.createdAt)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    disabled={deletingId === m.id}
                    className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 text-xs font-semibold disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                    {deletingId === m.id ? 'Removing…' : 'Remove'}
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      ))}
    </div>
  )
}
