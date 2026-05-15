'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Upload, Download } from 'lucide-react'

export default function StudentAssignmentActions({
  assignment,
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState(null)

  const locked = assignment.grade != null

  async function onSubmit(e) {
    e.preventDefault()
    if (locked) return
    setStatus(null)
    const form = e.currentTarget
    setPending(true)
    try {
      const fd = new FormData(form)
      const res = await fetch(`/api/student/assignments/${assignment.id}/submit`, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Submission failed.' })
        return
      }
      setStatus({ type: 'success', message: 'Submitted successfully.' })
      form.reset()
      router.refresh()
    } catch {
      setStatus({ type: 'error', message: 'Network error.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mt-2 space-y-2">
      {status && (
        <p
          className={`text-xs rounded px-2 py-1 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}
        >
          {status.message}
        </p>
      )}
      {assignment.description ? (
        <p className="text-xs text-gray-600 whitespace-pre-wrap border-l-2 border-sky-200 pl-3 py-1">{assignment.description}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span>
          Worth <strong>{assignment.maxPoints ?? 100}</strong> pts
        </span>
        {assignment.late && assignment.status !== 'PENDING' && (
          <span className="text-amber-700 font-semibold">Late submission</span>
        )}
      </div>
      {assignment.feedback != null && assignment.feedback !== '' && (
        <p className="text-xs bg-primary/5 text-primary px-3 py-2 rounded-md border border-primary/10">
          <span className="font-semibold">Instructor feedback:</span> {assignment.feedback}
        </p>
      )}
      {assignment.hasSubmission && (
        <a
          href={`/api/portal/submissions/${assignment.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-primary"
        >
          <Download className="w-3.5 h-3.5" aria-hidden strokeWidth={2} />
          Download your submission{assignment.submissionFileName ? ` (${assignment.submissionFileName})` : ''}
        </a>
      )}
      {!locked ? (
        <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2 pt-1">
          <label className="text-xs font-medium text-gray-600">{assignment.hasSubmission ? 'Replace upload' : 'Upload work'}</label>
          <input
            name="file"
            type="file"
            required={!assignment.hasSubmission}
            className="text-xs file:mr-2 file:text-xs file:font-semibold"
            disabled={pending}
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-md bg-secondary text-primary px-3 py-1.5 text-xs font-bold hover:brightness-95 disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden strokeWidth={2} />
            {pending ? 'Submitting…' : assignment.hasSubmission ? 'Re-submit' : 'Submit'}
          </button>
        </form>
      ) : (
        <p className="text-xs text-gray-500">Graded submission is locked.</p>
      )}
    </div>
  )
}
