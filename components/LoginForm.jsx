'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState('login')
  const [status, setStatus] = useState(null)
  const [pending, setPending] = useState(false)

  const intent = (searchParams.get('intent') ?? '').trim().toLowerCase()

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    const form = e.currentTarget
    const email = form.email.value.trim()
    const password = form.password.value

    if (!email || !password) {
      setStatus({ type: 'error', message: 'Email and password are required.' })
      return
    }

    if (mode === 'register') {
      const name = form.name?.value?.trim()
      if (!name || name.length < 2) {
        setStatus({ type: 'error', message: 'Please enter your full name.' })
        return
      }
    }

    setPending(true)
    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login'
      const body =
        mode === 'register'
          ? {
              email,
              password,
              name: form.name.value.trim(),
            }
          : { email, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' })
        return
      }

      let dest = searchParams.get('next') || '/student-portal'
      if (data.user?.role === 'ADMIN') {
        if (
          dest === '/student-portal' ||
          dest.startsWith('/student-portal') ||
          dest === '/lecturer-portal' ||
          dest.startsWith('/lecturer-portal')
        ) {
          dest = '/admin'
        }
      } else if (data.user?.role === 'LECTURER') {
        if (dest === '/student-portal' || dest.startsWith('/student-portal')) {
          dest = '/lecturer-portal'
        }
      }

      router.push(dest)
      router.refresh()
    } catch {
      setStatus({ type: 'error', message: 'Network error. Try again.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl p-8 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setStatus(null)
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
            mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register')
            setStatus(null)
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
            mode === 'register' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
          }`}
        >
          Register
        </button>
      </div>

      <h2 className="text-xl font-bold text-primary mb-2 text-center">
        {mode === 'login' ? 'Sign in to your account' : 'Create your student account'}
      </h2>

      {mode === 'login' && intent && (
        <p className="text-xs text-center text-gray-500 mb-6 leading-relaxed px-2">
          {intent === 'lecturer' && 'Faculty workspaces use the staff directory issued by ICT / HR.'}
          {intent === 'admin' &&
            'System administrators sign in here to provision lecturers, curricula, admissions, finance, CMS, analytics, and LMS guardrails.'}
          {intent === 'student' && 'Students enroll through Admissions/Registrar and then unlock materials, uploads, GPA widgets, notices, billing, messaging, and LMS sessions from one SSO.'}
        </p>
      )}

      {status && (
        <p
          className={`text-sm rounded-md px-3 py-2 mb-4 ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {status.message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <input
            name="name"
            type="text"
            placeholder="Full name"
            className="w-full border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary"
            disabled={pending}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary"
          disabled={pending}
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          className="w-full border border-gray-200 p-3.5 rounded-md text-sm focus:outline-none focus:border-primary"
          disabled={pending}
          minLength={mode === 'register' ? 6 : undefined}
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary text-white py-3.5 rounded-md font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {pending ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {mode === 'login' ? (
          <>
            New student?{' '}
            <Link href="/admissions" className="text-blue-600 font-semibold hover:text-blue-800">
              Apply for admission
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" onClick={() => setMode('login')} className="text-blue-600 font-semibold">
              Login
            </button>
          </>
        )}
      </p>
    </div>
  )
}
