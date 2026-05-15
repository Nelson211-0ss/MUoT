'use client'

import { useState } from 'react'

const programs = ['Software Engineering', 'Cybersecurity', 'Data Science', 'Cloud Computing']

export default function AdmissionsForm() {
  const [status, setStatus] = useState(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    const form = e.currentTarget
    const fullName = form.fullName.value.trim()
    const email = form.email.value.trim()
    const phone = form.phone.value.trim()
    const program = form.program.value

    if (!fullName || !email || !phone || !program) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' })
      return
    }

    setPending(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, program }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Submission failed.' })
        return
      }
      setStatus({ type: 'success', message: data.message || 'Application received.' })
      form.reset()
    } catch {
      setStatus({ type: 'error', message: 'Network error. Try again.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 grid gap-5">
      <h3 className="font-bold text-primary text-lg">Application Form</h3>

      {status && (
        <p
          className={`text-sm rounded-md px-3 py-2 ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {status.message}
        </p>
      )}

      <input
        name="fullName"
        type="text"
        placeholder="Full Name"
        className="border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary"
        disabled={pending}
      />
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        className="border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary"
        disabled={pending}
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        className="border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary"
        disabled={pending}
      />
      <select
        name="program"
        defaultValue=""
        required
        className="border border-gray-200 p-3.5 rounded-md text-sm bg-white focus:outline-none focus:border-primary text-gray-600"
        disabled={pending}
      >
        <option value="" disabled>
          Select program
        </option>
        {programs.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="bg-secondary text-primary py-3.5 rounded-md font-bold hover:brightness-95 transition-all disabled:opacity-60"
      >
        {pending ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}
