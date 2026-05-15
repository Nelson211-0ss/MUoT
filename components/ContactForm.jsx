'use client'

import { useState } from 'react'
import SectionHeader from '@/components/SectionHeader'

export default function ContactForm() {
  const [status, setStatus] = useState(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    const form = e.currentTarget
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const message = form.message.value.trim()

    if (!name || !email || message.length < 10) {
      setStatus({ type: 'error', message: 'Please complete all fields (message at least 10 characters).' })
      return
    }

    setPending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Could not send.' })
        return
      }
      setStatus({ type: 'success', message: data.message || 'Message sent.' })
      form.reset()
    } catch {
      setStatus({ type: 'error', message: 'Network error. Try again.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 grid gap-5 h-fit"
    >
      <SectionHeader title="Send a Message" subtitle="Fill out the form and we will get back to you." align="left" />

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
        name="name"
        type="text"
        placeholder="Your Name"
        className="border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary"
        disabled={pending}
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        className="border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary"
        disabled={pending}
      />
      <textarea
        name="message"
        rows={5}
        placeholder="Your Message"
        className="border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary resize-none"
        disabled={pending}
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-secondary text-primary py-3.5 rounded-md font-bold hover:brightness-95 transition-all disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
