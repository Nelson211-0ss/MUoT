'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  PenSquare,
  GraduationCap,
  Shield,
  LogOut,
  BookOpen,
  ClipboardList,
} from 'lucide-react'
import Logo from '@/components/Logo'
import NavHoverDropdown from '@/components/NavHoverDropdown'
import SocialLinks from '@/components/SocialLinks'
import { isHoDRoleSlug, isManagementRoleSlug } from '@/lib/rbac/constants'

const NAV_PRE_EL = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
]

const ADMISSION_NAV = [
  { id: 'hub', label: 'Admissions overview', subtitle: 'Strategic onboarding narrative', href: '/admissions' },
  {
    id: 'apply',
    label: 'Apply online',
    subtitle: 'Register an applicant account, then guided application wizard',
    href: '/admissions/apply',
  },
  { id: 'req', label: 'Requirements', subtitle: 'Portfolio & certification expectations', href: '/admissions/requirements' },
  { id: 'fees', label: 'Tuition & fees', subtitle: 'SSP schedules + acceptance levies', href: '/admissions/tuition' },
  { id: 'sch', label: 'Scholarships', subtitle: 'ICT empowerment awards', href: '/admissions/scholarships' },
  {
    id: 'status',
    label: 'Application status',
    subtitle: 'SSO timelines & desk messaging',
    href: '/admissions/status',
  },
  { id: 'faq', label: 'FAQs', subtitle: 'Admissions concierge automations', href: '/admissions/faqs' },
]

const NAV_AFTER_EL = [
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
]

const E_LEARNING_MENU = [
  {
    id: 'moodle',
    label: 'MUT E-Learning',
    href: '/moodle',
    subtitle: 'Courses, quizzes, forums, grading & learning resources',
    Icon: BookOpen,
  },
]

function shouldDisablePrefetch(href) {
  if (!href || href === '/') return false
  if (href.startsWith('/student-portal')) return true
  if (href.startsWith('/lecturer-portal')) return true
  if (href.startsWith('/hod-portal')) return true
  if (href.startsWith('/admin')) return true
  if (href.startsWith('/applicant-portal')) return true
  if (href.startsWith('/moodle')) return false
  return false
}

/** Signed-in users: direct links to their allowed areas (no dropdown). */
function portalMenuEntries(sessionUser) {
  if (!sessionUser) return []
  const role = String(sessionUser.role ?? 'STUDENT').trim().toUpperCase()
  if (isManagementRoleSlug(role)) {
    return [{ label: 'Management console', intent: 'admin', Icon: Shield, href: '/admin' }]
  }
  if (role === 'STUDENT') {
    return [{ label: 'Student', intent: 'student', Icon: GraduationCap, href: '/student-portal' }]
  }
  if (isHoDRoleSlug(role)) {
    return [{ label: 'Department head (HOD)', intent: 'hod', Icon: ClipboardList, href: '/hod-portal' }]
  }
  return []
}

function pathnameMatchesHref(pathname, href) {
  const base = href.split('?')[0]
  if (base === '/login') return false
  return pathname === base || pathname.startsWith(`${base}/`)
}

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  const [sessionUser, setSessionUser] = useState(null)
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => (r.status === 200 ? r.json() : null))
      .then((d) => setSessionUser(d?.user ?? null))
      .catch(() => setSessionUser(null))
  }, [])

  const portalEntries = useMemo(() => portalMenuEntries(sessionUser), [sessionUser])
  const elearningActive = useMemo(
    () => E_LEARNING_MENU.some(({ href }) => pathnameMatchesHref(pathname, href)),
    [pathname],
  )
  const admissionsActive = useMemo(
    () =>
      ['/admissions', '/applicant-portal'].some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      ),
    [pathname],
  )

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setSessionUser(null)
      router.push('/login')
      router.refresh()
      setOpen(false)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full shrink-0 bg-white shadow-sm ${isLoginPage ? 'border-b border-gray-100/90' : 'border-b border-gray-100'}`}
    >
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0">
          <Logo className={`shrink-0 ${isLoginPage ? 'h-10 w-10 sm:h-11 sm:w-11' : 'h-12 w-12 sm:h-14 sm:w-14'}`} />
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-primary leading-tight tracking-wide uppercase">
              Magwi University
            </p>
            <p className="text-[11px] sm:text-xs font-bold text-primary leading-tight tracking-wide uppercase">
              of Technology
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-secondary mt-0.5">Innovating the Future</p>
          </div>
        </Link>

        {!isLoginPage ? (
          <>
        <div className="hidden xl:flex items-center gap-5 2xl:gap-7 text-[14px] font-medium text-gray-700">
          {NAV_PRE_EL.map((link) => {
            const active = pathname === link.href.split('?')[0]
            const noPrefetch = shouldDisablePrefetch(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={noPrefetch ? false : undefined}
                className={`relative pb-1 flex items-center gap-1 hover:text-primary transition-colors ${
                  active ? 'text-primary' : ''
                }`}
              >
                {link.label}
                {active ? (
                  <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-6 bg-secondary rounded-full" />
                ) : null}
              </Link>
            )
          })}
          <NavHoverDropdown label="Admissions" active={admissionsActive}>
            <div role="menu" className="w-[18rem] rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Undergraduate admissions
              </p>
              {ADMISSION_NAV.map(({ id, label, subtitle, href }) => (
                <Link
                  key={id}
                  role="menuitem"
                  href={href}
                  prefetch={shouldDisablePrefetch(href) ? false : undefined}
                  className="flex items-start gap-2 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <PenSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden strokeWidth={1.75} />
                  <span>
                    <span className="block font-semibold text-primary">{label}</span>
                    <span className="text-xs text-slate-500">{subtitle}</span>
                  </span>
                </Link>
              ))}
            </div>
          </NavHoverDropdown>

          <NavHoverDropdown label="E-Learning" active={elearningActive}>
            <div role="menu" className="w-[15.75rem] rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">MUT E-Learning</p>
              {E_LEARNING_MENU.map(({ id, label, href, subtitle, Icon }) => (
                <Link
                  key={id}
                  role="menuitem"
                  href={href}
                  prefetch={shouldDisablePrefetch(href) ? false : undefined}
                  className="flex items-start gap-2 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden strokeWidth={1.75} />
                  <span>
                    <span className="block font-semibold text-primary">{label}</span>
                    <span className="text-xs text-slate-500">{subtitle}</span>
                  </span>
                </Link>
              ))}
            </div>
          </NavHoverDropdown>

          {NAV_AFTER_EL.map((link) => {
            const active = pathname === link.href.split('?')[0]
            const noPrefetch = shouldDisablePrefetch(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={noPrefetch ? false : undefined}
                className={`relative pb-1 flex items-center gap-1 hover:text-primary transition-colors ${
                  active ? 'text-primary' : ''
                }`}
              >
                {link.label}
                {active ? (
                  <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-6 bg-secondary rounded-full" />
                ) : null}
              </Link>
            )
          })}
          {portalEntries.length > 0
            ? portalEntries.map(({ label, href, Icon }) => {
                const portalLinkActive = pathnameMatchesHref(pathname, href)
                const noPrefetch = shouldDisablePrefetch(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch={noPrefetch ? false : undefined}
                    className={`relative pb-1 inline-flex items-center gap-1.5 hover:text-primary transition-colors ${
                      portalLinkActive ? 'text-primary' : ''
                    }`}
                  >
                    <Icon className="w-[17px] h-[17px] shrink-0 opacity-90" aria-hidden strokeWidth={1.75} />
                    {label}
                    {portalLinkActive ? (
                      <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-6 bg-secondary rounded-full" />
                    ) : null}
                  </Link>
                )
              })
            : null}
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          {sessionUser ? (
            <button
              type="button"
              disabled={signingOut}
              onClick={handleSignOut}
              className="border border-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:border-red-600 hover:text-red-700 transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
              aria-busy={signingOut}
            >
              <LogOut size={17} strokeWidth={1.75} aria-hidden />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          ) : (
            <Link
              href="/login"
              prefetch={false}
              className="border border-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <LogIn size={17} strokeWidth={1.75} aria-hidden />
              Login
            </Link>
          )}
          <Link href="/admissions/apply"
            className="bg-secondary text-primary px-5 py-2 rounded-md text-sm font-bold hover:brightness-95 transition-all inline-flex items-center gap-2"
          >
            <PenSquare size={17} strokeWidth={1.75} aria-hidden />
            Apply Now
          </Link>
        </div>

          </>
        ) : sessionUser ? (
          <div className="flex flex-1 justify-end items-center shrink-0">
            <button
              type="button"
              disabled={signingOut}
              onClick={handleSignOut}
              className="border border-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:border-red-600 hover:text-red-700 transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
              aria-busy={signingOut}
            >
              <LogOut size={17} strokeWidth={1.75} aria-hidden />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        ) : (
          <div className="flex flex-1 min-w-0 items-center justify-end gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-primary px-2.5 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <Link href="/admissions/apply"
              prefetch={false}
              className="bg-secondary text-primary px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition-all inline-flex items-center gap-2 shrink-0"
            >
              <PenSquare size={16} strokeWidth={1.75} aria-hidden />
              Apply
            </Link>
          </div>
        )}

        <button
          type="button"
          className={`${isLoginPage ? 'hidden' : 'xl:hidden'} p-2 text-primary shrink-0`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && !isLoginPage ? (
        <div className="xl:hidden border-t px-4 py-4 flex flex-col gap-1 font-medium text-gray-800 bg-white max-h-[min(82vh,_640px)] overflow-y-auto">
          {NAV_PRE_EL.map((link) => {
            const noPrefetch = shouldDisablePrefetch(link.href)
            return (
              <Link
                key={`m-${link.href}`}
                href={link.href}
                prefetch={noPrefetch ? false : undefined}
                onClick={() => setOpen(false)}
                className="py-2 border-b border-gray-50 hover:text-primary"
              >
                {link.label}
              </Link>
            )
          })}
          <details className="border-b border-gray-50 py-2 group">
            <summary className="list-none cursor-pointer py-2 flex items-center justify-between hover:text-primary [&::-webkit-details-marker]:hidden">
              <span>Admissions</span>
              <ChevronDown size={18} className="opacity-70 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="pl-3 pt-2 flex flex-col gap-1 border-l-2 border-slate-100 ml-1 mb-2">
              {ADMISSION_NAV.map(({ id, label, href }) => (
                <Link
                  key={`mob-adm-${id}`}
                  href={href}
                  prefetch={shouldDisablePrefetch(href) ? false : undefined}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm inline-flex items-center gap-2 text-primary font-semibold"
                >
                  <PenSquare className="w-4 h-4 shrink-0" aria-hidden strokeWidth={1.75} />
                  {label}
                </Link>
              ))}
            </div>
          </details>
          <details className="border-b border-gray-50 py-2 group">
            <summary className="list-none cursor-pointer py-2 flex items-center justify-between hover:text-primary [&::-webkit-details-marker]:hidden">
              <span>E-Learning</span>
              <ChevronDown size={18} className="opacity-70 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="pl-3 pt-2 flex flex-col gap-1 border-l-2 border-slate-100 ml-1 mb-2">
              {E_LEARNING_MENU.map(({ id, label, href, Icon }) => (
                <Link
                  key={`mob-el-${id}`}
                  href={href}
                  prefetch={shouldDisablePrefetch(href) ? false : undefined}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm inline-flex items-center gap-2 text-primary font-semibold"
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden strokeWidth={1.75} />
                  {label}
                </Link>
              ))}
            </div>
          </details>
          {NAV_AFTER_EL.map((link) => {
            const noPrefetch = shouldDisablePrefetch(link.href)
            return (
              <Link
                key={`m-${link.href}`}
                href={link.href}
                prefetch={noPrefetch ? false : undefined}
                onClick={() => setOpen(false)}
                className="py-2 border-b border-gray-50 hover:text-primary"
              >
                {link.label}
              </Link>
            )
          })}
          {portalEntries.length > 0 ? (
            <>
              <p className="px-1 pb-2 text-[10px] uppercase font-bold text-gray-400 tracking-wide mt-2">Your portals</p>
              {portalEntries.map(({ label, href, Icon, intent }) => (
                <Link
                  key={`mob-portal-${intent ?? href}`}
                  href={href}
                  prefetch={shouldDisablePrefetch(href) ? false : undefined}
                  onClick={() => setOpen(false)}
                  className="py-2 border-b border-gray-50 text-sm inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4"
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden strokeWidth={1.75} />
                  {label}
                </Link>
              ))}
            </>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-3">
            {!sessionUser ? (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="border px-4 py-2 rounded-md text-sm inline-flex items-center gap-2"
              >
                <LogIn size={16} strokeWidth={1.75} aria-hidden />
                General login
              </Link>
            ) : (
              <button
                type="button"
                disabled={signingOut}
                onClick={() => {
                  void handleSignOut()
                }}
                className="border border-gray-300 px-4 py-2 rounded-md text-sm inline-flex items-center gap-2 disabled:opacity-60"
              >
                <LogOut size={16} strokeWidth={1.75} aria-hidden />
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            )}
            <Link href="/admissions/apply"
              onClick={() => setOpen(false)}
              className="bg-secondary text-primary px-4 py-2 rounded-md text-sm font-bold inline-flex items-center gap-2"
            >
              <PenSquare size={16} strokeWidth={1.75} aria-hidden />
              Apply Now
            </Link>
          </div>
          <div className="pt-5 mt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Follow us</p>
            <SocialLinks variant="light" />
          </div>
        </div>
      ) : null}
    </header>
  )
}