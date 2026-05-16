'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ClipboardList,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Shield,
  UserCircle,
  UserRound,
} from 'lucide-react'

import { isHoDRoleSlug, isManagementRoleSlug } from '@/lib/rbac/constants'

const INTENT_HEADER = {
  student: { Icon: GraduationCap, eyebrow: 'Student sign-in' },
  hod: { Icon: ClipboardList, eyebrow: 'Department head sign-in' },
  admin: { Icon: Shield, eyebrow: 'Management sign-in' },
  applicant: { Icon: UserCircle, eyebrow: 'Applicant' },
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState('login')
  const [status, setStatus] = useState(null)
  const [pending, setPending] = useState(false)

  const intent = (searchParams.get('intent') ?? '').trim().toLowerCase()
  const applicantIntent = intent === 'applicant'
  const applicantRegister = applicantIntent && (searchParams.get('register') ?? '') === '1'

  const subtitle = useMemo(() => {
    if (intent === 'hod')
      return 'Heads of department shape degree modules and certify semester transcripts before LMS delivery syncs externally.'
    if (intent === 'admin') return 'System administrators authenticate for staffing, curricula, admissions, finance, CMS hooks.'
    if (intent === 'student')
      return 'Use your 10-digit learner number and password. First time: use that number as both username and password, then choose a permanent password.'
    if (applicantIntent && applicantRegister)
      return 'Step 1: create your MUoT applicant account (registration is mandatory before submitting an application). Step 2: you are taken straight into the online application wizard.'
    if (applicantIntent)
      return 'Sign in with the email and password you used at registration — continue your application or admission dossier.'
    return ''
  }, [intent, applicantIntent, applicantRegister])

  useEffect(() => {
    if (!applicantIntent) {
      setMode('login')
      return
    }
    setMode(applicantRegister ? 'register' : 'login')
  }, [applicantIntent, applicantRegister])

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

      if (!applicantIntent) {
        setStatus({
          type: 'error',
          message: 'Learner accounts cannot be registered here—they are assigned by administrators after admission.',
        })
        return
      }

      const name = String(form.name?.value ?? '').trim()
      if (!name || name.length < 2) {
        setStatus({ type: 'error', message: 'Please enter your full name.' })
        return
      }

      const phone = String(form.phone?.value ?? '').trim()
      if (!phone || phone.length < 8) {
        setStatus({ type: 'error', message: 'Provide a reachable phone line for Admissions callbacks.' })
        return
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
      } else {
        endpoint = '/api/admissions/register'
        body = {
          email: String(form.email?.value ?? '').trim(),
          password,
          name: String(form.name.value).trim(),
          phone: String(form.phone.value).trim(),
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

  const intentKey = INTENT_HEADER[intent] ? intent : null
  const IntentHeaderVisual = intentKey ? INTENT_HEADER[intentKey]?.Icon : null

  const field =
    'w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-[15px] text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500'

  const iconLeft =
    'pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 shrink-0'

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <div className="rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur-sm px-7 py-9 sm:p-10 shadow-[0_24px_64px_-28px_rgba(15,23,42,0.22)]">
        <h1 className="text-2xl sm:text-[1.65rem] font-semibold tracking-tight text-gray-900 text-center text-balance leading-snug">
          {applicantIntent && mode === 'register'
            ? 'Admissions registration'
            : mode === 'login'
              ? 'Sign in'
              : 'Admissions registration'}
        </h1>

        {(mode === 'login' || (applicantIntent && mode === 'register')) && intentKey && IntentHeaderVisual ? (
          <div className="flex flex-col items-center gap-2 mt-8 mb-1">
            <span className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl bg-primary/[0.09] text-primary ring-1 ring-primary/10">
              <IntentHeaderVisual className="h-7 w-7" strokeWidth={1.6} aria-hidden />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{INTENT_HEADER[intentKey].eyebrow}</p>
          </div>
        ) : null}

        {mode === 'login' && subtitle ? (
          <p
            className={`text-sm text-center text-gray-500 mb-8 leading-relaxed max-w-[20rem] mx-auto ${intentKey ? 'mt-3' : 'mt-5'}`}
          >
            {subtitle}
          </p>
        ) : mode === 'login' ? (
          <div className="mb-8 mt-2" aria-hidden />
        ) : null}

        {status ? (
          <p
            className={`text-sm rounded-xl px-4 py-3 mb-6 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-red-50 text-red-900 border border-red-100'
            }`}
            role={status.type === 'error' ? 'alert' : undefined}
          >
            {status.message}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' ? (
            <div className="relative">
              <UserRound className={iconLeft} strokeWidth={1.75} aria-hidden />
              <input
                name="name"
                type="text"
                placeholder={applicantIntent ? 'Full legal name (as on ID)' : 'Full name'}
                className={field}
                disabled={pending}
                required
              />
            </div>
          ) : null}
          {mode === 'register' && applicantIntent ? (
            <div className="relative">
              <Phone className={iconLeft} strokeWidth={1.75} aria-hidden />
              <input
                name="phone"
                type="tel"
                placeholder="Phone (+SS / international)"
                className={field}
                disabled={pending}
                required
              />
            </div>
          ) : null}
          {mode === 'login' ? (
            <div className="relative">
              <UserRound className={iconLeft} strokeWidth={1.75} aria-hidden />
              <input
                name="identifier"
                type="text"
                inputMode={intent === 'student' ? 'numeric' : 'email'}
                autoComplete="username"
                placeholder={
                  intent === 'student'
                    ? 'Student number or email'
                    : applicantIntent
                      ? 'Applicant email'
                      : 'Email address'
                }
                required
                className={field}
                disabled={pending}
              />
            </div>
          ) : (
            <div className="relative">
              <Mail className={iconLeft} strokeWidth={1.75} aria-hidden />
              <input name="email" type="email" placeholder="Email" required className={field} disabled={pending} />
            </div>
          )}
          <div className="relative">
            <Lock className={iconLeft} strokeWidth={1.75} aria-hidden />
            <input
              name="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder={mode === 'register' ? 'Password (at least 8 characters)' : 'Password'}
              className={field}
              disabled={pending}
              minLength={mode === 'register' ? 8 : undefined}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-primary text-white py-3.5 text-[15px] font-semibold shadow-sm shadow-primary/25 hover:opacity-[0.97] active:opacity-95 transition-opacity disabled:opacity-50 disabled:shadow-none mt-2"
          >
            {pending ? 'Please wait…' : mode === 'login' ? 'Continue' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 leading-relaxed">
          {applicantIntent ? (
            mode === 'login' ? (
              <>
                Need an admissions account?{' '}
                <Link href="/login?intent=applicant&register=1" prefetch={false} className="font-semibold text-primary hover:underline underline-offset-4">
                  Register here
                </Link>
              </>
            ) : (
              <>
                Already registered?{' '}
                <Link href="/login?intent=applicant" prefetch={false} className="font-semibold text-primary hover:underline underline-offset-4">
                  Sign in
                </Link>
              </>
            )
          ) : mode === 'login' ? (
            <>
              Applying as a new applicant?{' '}
              <Link href="/admissions/apply" className="font-semibold text-primary hover:underline underline-offset-4">
                Start at admissions apply
              </Link>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-primary hover:underline underline-offset-4"
              >
                Sign in
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  )
}
