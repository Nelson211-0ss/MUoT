'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowRight,
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
  hod: { Icon: ClipboardList, eyebrow: 'Head of department' },
  admin: { Icon: Shield, eyebrow: 'Management sign-in' },
  applicant: { Icon: UserCircle, eyebrow: 'Applicant account' },
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
      return 'Certify modules and semester transcripts before results sync to student records.'
    if (intent === 'admin') return 'Staffing, curricula, admissions, finance, and CMS controls for authorised roles.'
    if (intent === 'student')
      return 'Use your 10-digit learner number and password. First visit: use the number as both username and password, then set a permanent password.'
    if (applicantIntent && applicantRegister)
      return 'Create your applicant account, then continue straight into the online application wizard.'
    if (applicantIntent) return 'Sign in with the email and password from registration to continue your dossier.'
    return 'Enter your institutional email, learner number, or applicant email.'
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

  const title =
    applicantIntent && mode === 'register'
      ? 'Create applicant account'
      : mode === 'login'
        ? 'Welcome back'
        : 'Admissions registration'

  const field =
    'w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-4 text-[15px] text-slate-900 outline-none transition-[border-color,box-shadow,background-color] placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60'

  const iconLeft =
    'pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400'

  function Field({ id, label, icon: Icon, children }) {
    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
        <div className="relative">
          <Icon className={iconLeft} strokeWidth={1.75} aria-hidden />
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[440px]">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/25">
        <div className="h-1.5 bg-secondary" aria-hidden />

        <div className="px-7 py-8 sm:px-9 sm:py-9">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-primary sm:text-[1.65rem]">{title}</h2>
            <p className="mx-auto mt-2 max-w-[22rem] text-sm leading-relaxed text-slate-600">{subtitle}</p>
          </div>

          {intentKey && IntentHeaderVisual ? (
            <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <IntentHeaderVisual className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="text-left text-xs font-bold uppercase tracking-wider text-primary">
                {INTENT_HEADER[intentKey].eyebrow}
              </p>
            </div>
          ) : null}

          {status ? (
            <p
              className={`mt-6 rounded-xl px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border border-red-200 bg-red-50 text-red-900'
              }`}
              role={status.type === 'error' ? 'alert' : undefined}
            >
              {status.message}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' ? (
              <Field id="name" label="Full name" icon={UserRound}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="As shown on national ID"
                  className={field}
                  disabled={pending}
                  required
                />
              </Field>
            ) : null}

            {mode === 'register' && applicantIntent ? (
              <Field id="phone" label="Phone" icon={Phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+211 …"
                  className={field}
                  disabled={pending}
                  required
                />
              </Field>
            ) : null}

            {mode === 'login' ? (
              <Field
                id="identifier"
                label={intent === 'student' ? 'Learner number or email' : applicantIntent ? 'Email' : 'Email or username'}
                icon={UserRound}
              >
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  inputMode={intent === 'student' ? 'numeric' : 'email'}
                  autoComplete="username"
                  placeholder={
                    intent === 'student' ? '10-digit learner number' : applicantIntent ? 'you@example.com' : 'Email address'
                  }
                  required
                  className={field}
                  disabled={pending}
                />
              </Field>
            ) : (
              <Field id="email" label="Email" icon={Mail}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className={field}
                  disabled={pending}
                />
              </Field>
            )}

            <Field id="password" label="Password" icon={Lock}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
                className={field}
                disabled={pending}
                minLength={mode === 'register' ? 8 : undefined}
                required
              />
            </Field>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              {!pending ? <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden /> : null}
            </button>
          </form>

          <p className="mt-7 text-center text-sm leading-relaxed text-slate-500">
            {applicantIntent ? (
              mode === 'login' ? (
                <>
                  Need an admissions account?{' '}
                  <Link
                    href="/login?intent=applicant&register=1"
                    prefetch={false}
                    className="font-semibold text-primary hover:underline"
                  >
                    Register here
                  </Link>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <Link href="/login?intent=applicant" prefetch={false} className="font-semibold text-primary hover:underline">
                    Sign in
                  </Link>
                </>
              )
            ) : mode === 'login' ? (
              <>
                Applying for admission?{' '}
                <Link href="/admissions/apply" className="font-semibold text-primary hover:underline">
                  Start application
                </Link>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
