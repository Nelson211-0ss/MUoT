'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { isHoDRoleSlug, isManagementRoleSlug } from '@/lib/rbac/constants'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState('login')
  const [status, setStatus] = useState(null)
  const [pending, setPending] = useState(false)

  const intent = (searchParams.get('intent') ?? '').trim().toLowerCase()
  const applicantIntent = intent === 'applicant'

  const subtitle = useMemo(() => {
    if (intent === 'lecturer') return 'Faculty workspaces use ICT / HR directory credentials.'
    if (intent === 'hod')
      return 'Heads of department shape degree modules and certify semester transcripts before LMS delivery syncs externally.'
    if (intent === 'admin') return 'System administrators authenticate for staffing, curricula, admissions, finance, CMS hooks.'
    if (intent === 'student')
      return 'Registrar-issued learner numbers are 10 digits. First login repeats that number once for both fields, then portal forces a bespoke password.'
    if (applicantIntent) return 'Prospective undergraduates onboard an APPLICANT JWT for dossiers, OTP email proof, uploads and tuition intents.'
    return ''
  }, [intent, applicantIntent])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    const form = e.currentTarget
    const password = form.password.value

    if (mode === 'login') {
      const identifier = String(form.identifier?.value ?? '').trim()
      if (!identifier || !password) {
        setStatus({ type: 'error', message: 'Student number / email and password are required.' })
        return
      }
    } else {
      const email = String(form.email?.value ?? '').trim()
      if (!email || !password) {
        setStatus({ type: 'error', message: 'Email and password are required.' })
        return
      }

      const name = String(form.name?.value ?? '').trim()
      if (!name || name.length < 2) {
        setStatus({ type: 'error', message: 'Please enter your full name.' })
        return
      }

      if (applicantIntent) {
        const phone = String(form.phone?.value ?? '').trim()
        if (!phone || phone.length < 8) {
          setStatus({ type: 'error', message: 'Provide a reachable phone line for Admissions callbacks.' })
          return
        }
      }
    }

    setPending(true)
    try {
      let endpoint = '/api/auth/login'
      /** @type {Record<string,string>} */
      let body

      if (mode === 'login') {
        const identifier = String(form.identifier?.value ?? '').trim()
        body = { identifier, password }
      } else if (applicantIntent) {
        endpoint = '/api/admissions/register'
        body = {
          email: String(form.email?.value ?? '').trim(),
          password,
          name: String(form.name.value).trim(),
          phone: String(form.phone.value).trim(),
        }
      } else {
        endpoint = '/api/auth/register'
        body = {
          email: String(form.email?.value ?? '').trim(),
          password,
          name: String(form.name.value).trim(),
        }
      }

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

      if (mode === 'login' && data.mustChoosePassword) {
        router.push('/student-portal/setup-password')
        router.refresh()
        return
      }

      /** @typedef {{ user?: { role?: string }}} SessionPayload */
      const payload = /** @type {SessionPayload} */ (data)
      let dest = searchParams.get('next') || '/student-portal'
      const role = String(payload.user?.role ?? 'STUDENT').trim().toUpperCase()

      if (role === 'APPLICANT') {
        if (!dest || dest.startsWith('/student-portal')) dest = '/applicant-portal'
      } else if (isManagementRoleSlug(role)) {
        if (
          dest === '/student-portal' ||
          dest.startsWith('/student-portal') ||
          dest === '/lecturer-portal' ||
          dest.startsWith('/lecturer-portal') ||
          dest === '/hod-portal' ||
          dest.startsWith('/hod-portal') ||
          dest === '/applicant-portal' ||
          dest.startsWith('/applicant-portal')
        ) {
          dest = '/admin'
        }
      } else if (role === 'LECTURER') {
        if (
          dest === '/student-portal' ||
          dest.startsWith('/student-portal') ||
          dest === '/hod-portal' ||
          dest.startsWith('/hod-portal')
        ) {
          dest = '/lecturer-portal'
        }
      } else if (isHoDRoleSlug(role)) {
        if (
          dest === '/student-portal' ||
          dest.startsWith('/student-portal') ||
          dest === '/lecturer-portal' ||
          dest.startsWith('/lecturer-portal') ||
          dest === '/applicant-portal' ||
          dest.startsWith('/applicant-portal') ||
          dest === '/admin' ||
          dest.startsWith('/admin')
        ) {
          dest = '/hod-portal'
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

  const showStudentRegisterShell = mode === 'register' && !applicantIntent

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-8 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-white/10">
      <div className="flex rounded-lg bg-gray-100 dark:bg-slate-800 p-1 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setStatus(null)
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
            mode === 'login' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-gray-600 dark:text-slate-400'
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
            mode === 'register'
              ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
              : 'text-gray-600 dark:text-slate-400'
          }`}
        >
          Register
        </button>
      </div>

      <h2 className="text-xl font-bold text-primary dark:text-secondary mb-2 text-center">
        {applicantIntent && mode === 'register'
          ? 'Create your admissions account'
          : mode === 'login'
            ? 'Sign in securely'
            : 'Create learner account'}
      </h2>

      {mode === 'login' && intent ? (
        <p className="text-xs text-center text-gray-500 dark:text-slate-400 mb-6 leading-relaxed px-2">{subtitle}</p>
      ) : null}

      {status && (
        <p
          className={`text-sm rounded-md px-3 py-2 mb-4 ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-100'
              : 'bg-red-50 text-red-800 dark:bg-red-500/15 dark:text-red-100'
          }`}
        >
          {status.message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' ? (
          <input
            name="name"
            type="text"
            placeholder={applicantIntent ? 'Full legal name (as on ID)' : 'Full name'}
            className="w-full border border-gray-200 dark:border-white/10 p-3.5 rounded-md text-sm bg-white dark:bg-slate-950 focus:outline-none focus:border-primary"
            disabled={pending}
            required
          />
        ) : null}
        {mode === 'register' && applicantIntent ? (
          <input
            name="phone"
            type="tel"
            placeholder="Phone (+SS / international)"
            className="w-full border border-gray-200 dark:border-white/10 p-3.5 rounded-md text-sm bg-white dark:bg-slate-950 focus:outline-none focus:border-primary"
            disabled={pending}
            required
          />
        ) : null}
        {mode === 'login' ? (
          <input
            name="identifier"
            type="text"
            inputMode={intent === 'student' ? 'numeric' : 'email'}
            autoComplete="username"
            placeholder={
              intent === 'student'
                ? '10-digit student number or university email'
                : applicantIntent
                  ? 'Applicant email'
                  : 'Email address'
            }
            required
            className="w-full border border-gray-200 dark:border-white/10 p-3.5 rounded-md text-sm bg-white dark:bg-slate-950 focus:outline-none focus:border-primary"
            disabled={pending}
          />
        ) : (
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border border-gray-200 dark:border-white/10 p-3.5 rounded-md text-sm bg-white dark:bg-slate-950 focus:outline-none focus:border-primary"
            disabled={pending}
          />
        )}
        <input
          name="password"
          type="password"
          placeholder={applicantIntent && mode === 'register' ? 'Password (≥8 chars)' : 'Password (≥6 chars)'}
          className="w-full border border-gray-200 dark:border-white/10 p-3.5 rounded-md text-sm bg-white dark:bg-slate-950 focus:outline-none focus:border-primary"
          disabled={pending}
          minLength={applicantIntent && mode === 'register' ? 8 : mode === 'register' ? 6 : undefined}
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary text-white py-3.5 rounded-md font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {pending ? 'Please wait…' : mode === 'login' ? 'Login' : applicantIntent ? 'Create applicant account' : 'Create learner account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {mode === 'login' ? (
          <>
            Applying to MUT?{' '}
            <Link href="/login?intent=applicant&next=/applicant-portal/application" className="text-blue-600 dark:text-secondary font-semibold">
              Admissions login
            </Link>
          </>
        ) : showStudentRegisterShell ? (
          <>
            Already onboarded?{' '}
            <button type="button" onClick={() => setMode('login')} className="text-blue-600 dark:text-secondary font-semibold">
              Login
            </button>
          </>
        ) : (
          <>
            Have an account already?{' '}
            <button type="button" onClick={() => setMode('login')} className="text-blue-600 dark:text-secondary font-semibold">
              Login
            </button>
          </>
        )}
      </p>

      {!applicantIntent || mode !== 'login' ? null : (
        <p className="mt-6 text-[11px] text-center leading-relaxed text-gray-500">{subtitle}</p>
      )}
    </div>
  )
}
