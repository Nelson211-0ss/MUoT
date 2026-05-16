'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  PenSquare,
  GraduationCap,
  Laptop,
  Shield,
  LogOut,
  BookOpen,
} from 'lucide-react'
import Logo from '@/components/Logo'
import SocialLinks from '@/components/SocialLinks'

/** Top-level routes (E-Learning and Portals each have their own dropdown). */
const mainLinksBeforeLearning = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/admissions', label: 'Admissions' },
]

const mainLinksAfterLearning = [
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
]

/** E-Learning hub (dropdown keeps room for more LMS-facing links later). */
const E_LEARNING_MENU = [
  {
    id: 'catalogue',
    label: 'Course catalogue',
    href: '/courses',
    subtitle: 'Browse listings, modalities, and prerequisites',
    Icon: BookOpen,
  },
]

const LOGIN_TARGETS = [
  {
    label: 'Student Portal',
    next: '/student-portal',
    intent: 'student',
    Icon: GraduationCap,
  },
  {
    label: 'Lecturer Portal',
    next: '/lecturer-portal',
    intent: 'lecturer',
    Icon: Laptop,
  },
  {
    label: 'Administrator',
    next: '/admin',
    intent: 'admin',
    Icon: Shield,
  },
]

function shouldDisablePrefetch(href) {
  if (!href || href === '/') return false
  if (href.startsWith('/student-portal')) return true
  if (href.startsWith('/lecturer-portal')) return true
  if (href.startsWith('/admin')) return true
  if (href.startsWith('/courses')) return false
  return false
}

/** Guests see login URLs; authenticated users see only workspaces their role allows. */
function portalMenuEntries(sessionUser) {
  if (!sessionUser) {
    return LOGIN_TARGETS.map(({ label, next, intent, Icon }) => ({
      label,
      intent,
      Icon,
      href: `/login?next=${encodeURIComponent(next)}&intent=${intent}`,
    }))
  }
  const role = String(sessionUser.role ?? 'STUDENT').trim().toUpperCase()
  if (role === 'STUDENT') {
    return [{ label: 'Student portal', intent: 'student', Icon: GraduationCap, href: '/student-portal' }]
  }
  if (role === 'LECTURER') {
    return [{ label: 'Lecturer portal', intent: 'lecturer', Icon: Laptop, href: '/lecturer-portal' }]
  }
  if (role === 'ADMIN') {
    return [{ label: 'Administrator', intent: 'admin', Icon: Shield, href: '/admin' }]
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
  const [loginMenu, setLoginMenu] = useState(false)
  const [portalsMenu, setPortalsMenu] = useState(false)
  const [elearningMenu, setElearningMenu] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const pathname = usePathname()
  const [sessionUser, setSessionUser] = useState(null)
  const loginRef = useRef(null)
  const portalsRef = useRef(null)
  const elearningRef = useRef(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => (r.status === 200 ? r.json() : null))
      .then((d) => setSessionUser(d?.user ?? null))
      .catch(() => setSessionUser(null))
  }, [])

  const portalEntries = useMemo(() => portalMenuEntries(sessionUser), [sessionUser])
  const portalsActive = useMemo(
    () => portalEntries.some(({ href }) => pathnameMatchesHref(pathname, href)),
    [pathname, portalEntries],
  )
  const elearningActive = useMemo(
    () => E_LEARNING_MENU.some(({ href }) => pathnameMatchesHref(pathname, href)),
    [pathname],
  )

  useEffect(() => {
    function onPointerDown(ev) {
      const t = ev.target
      if (loginRef.current && !loginRef.current.contains(t)) setLoginMenu(false)
      if (portalsRef.current && !portalsRef.current.contains(t)) setPortalsMenu(false)
      if (elearningRef.current && !elearningRef.current.contains(t)) setElearningMenu(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setSessionUser(null)
      router.push('/login')
      router.refresh()
      setLoginMenu(false)
      setPortalsMenu(false)
      setElearningMenu(false)
      setOpen(false)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-gray-100 bg-white shadow-sm">
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Logo className="h-12 w-12 sm:h-14 sm:w-14 shrink-0" />
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

        <div className="hidden xl:flex items-center gap-5 2xl:gap-7 text-[14px] font-medium text-gray-700">
          {mainLinksBeforeLearning.map((link) => {
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
          <div ref={elearningRef} className="relative">
            <button
              type="button"
              aria-expanded={elearningMenu}
              aria-haspopup="menu"
              aria-label="E-Learning menu"
              onClick={() => {
                setElearningMenu((m) => !m)
                setPortalsMenu(false)
              }}
              className={`relative pb-1 inline-flex items-center gap-1 hover:text-primary transition-colors ${
                elearningActive ? 'text-primary' : ''
              }`}
            >
              E-Learning
              <ChevronDown
                size={16}
                className={`opacity-70 transition-transform ${elearningMenu ? 'rotate-180' : ''}`}
                aria-hidden
              />
              {elearningActive ? (
                <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-6 bg-secondary rounded-full" />
              ) : null}
            </button>
            {elearningMenu ? (
              <div
                role="menu"
                className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[15.75rem] rounded-xl border border-gray-100 bg-white shadow-xl py-2 z-[60]"
              >
                <p className="px-3 pb-1 text-[10px] uppercase font-bold text-gray-400 tracking-wide">
                  Online teaching & courses
                </p>
                {E_LEARNING_MENU.map(({ id, label, href, subtitle, Icon }) => (
                  <Link
                    key={id}
                    role="menuitem"
                    href={href}
                    prefetch={shouldDisablePrefetch(href) ? false : undefined}
                    className="flex items-start gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-slate-50"
                    onClick={() => setElearningMenu(false)}
                  >
                    <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden strokeWidth={1.75} />
                    <span>
                      <span className="font-semibold text-primary block">{label}</span>
                      <span className="text-xs text-gray-500">{subtitle}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {mainLinksAfterLearning.map((link) => {
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
          <div ref={portalsRef} className="relative">
            <button
              type="button"
              aria-expanded={portalsMenu}
              aria-haspopup="menu"
              aria-label="Portals menu"
              onClick={() => {
                setPortalsMenu((m) => !m)
                setElearningMenu(false)
              }}
              className={`relative pb-1 inline-flex items-center gap-1 hover:text-primary transition-colors ${
                portalsActive ? 'text-primary' : ''
              }`}
            >
              Portals
              <ChevronDown
                size={16}
                className={`opacity-70 transition-transform ${portalsMenu ? 'rotate-180' : ''}`}
                aria-hidden
              />
              {portalsActive ? (
                <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-6 bg-secondary rounded-full" />
              ) : null}
            </button>
            {portalsMenu ? (
              <div
                role="menu"
                className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[15.75rem] rounded-xl border border-gray-100 bg-white shadow-xl py-2 z-[60]"
              >
                <p className="px-3 pb-1 text-[10px] uppercase font-bold text-gray-400 tracking-wide">
                  {sessionUser ? 'Your workspace' : 'Sign in to continue'}
                </p>
                {portalEntries.map(({ label, href, Icon, intent }) => (
                  <Link
                    key={intent}
                    role="menuitem"
                    href={href}
                    prefetch={shouldDisablePrefetch(href) ? false : undefined}
                    className="flex items-start gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-slate-50"
                    onClick={() => setPortalsMenu(false)}
                  >
                    <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden strokeWidth={1.75} />
                    <span>
                      <span className="font-semibold text-primary block">{label}</span>
                      <span className="text-xs text-gray-500">
                        {sessionUser ? 'Open your portal' : 'SSO-connected workspace'}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
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
            <div ref={loginRef} className="relative">
              <button
                type="button"
                aria-expanded={loginMenu}
                aria-haspopup="menu"
                onClick={() => setLoginMenu((m) => !m)}
                className="border border-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                <LogIn size={17} strokeWidth={1.75} aria-hidden />
                Login
                <ChevronDown size={14} strokeWidth={2} className={loginMenu ? 'rotate-180' : ''} />
              </button>
              {loginMenu ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-[15.5rem] rounded-xl border border-gray-100 bg-white shadow-xl py-2 z-[60]"
                >
                  <p className="px-3 pb-1 text-[10px] uppercase font-bold text-gray-400 tracking-wide">
                    Secure portals
                  </p>
                  {LOGIN_TARGETS.map(({ label, next, intent, Icon }) => (
                    <Link
                      key={intent}
                      role="menuitem"
                      href={`/login?next=${encodeURIComponent(next)}&intent=${intent}`}
                      prefetch={false}
                      className="flex items-start gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-slate-50"
                      onClick={() => setLoginMenu(false)}
                    >
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden strokeWidth={1.75} />
                      <span>
                        <span className="font-semibold text-primary block">{label}</span>
                        <span className="text-xs text-gray-500">SSO-connected workspace</span>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          )}
          <Link
            href="/admissions"
            className="bg-secondary text-primary px-5 py-2 rounded-md text-sm font-bold hover:brightness-95 transition-all inline-flex items-center gap-2"
          >
            <PenSquare size={17} strokeWidth={1.75} aria-hidden />
            Apply Now
          </Link>
        </div>

        <button
          type="button"
          className="xl:hidden p-2 text-primary"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open ? (
        <div className="xl:hidden border-t px-4 py-4 flex flex-col gap-1 font-medium text-gray-800 bg-white max-h-[min(82vh,_640px)] overflow-y-auto">
          {mainLinksBeforeLearning.map((link) => {
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
          {mainLinksAfterLearning.map((link) => {
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
              <span>Portals</span>
              <ChevronDown size={18} className="opacity-70 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="pl-3 pt-2 flex flex-col gap-1 border-l-2 border-slate-100 ml-1 mb-2">
              {portalEntries.map(({ label, href, Icon, intent }) => (
                <Link
                  key={`mob-portal-${intent}`}
                  href={href}
                  prefetch={shouldDisablePrefetch(href) ? false : undefined}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm inline-flex items-center gap-2 text-primary font-semibold"
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden strokeWidth={1.75} />
                  {label}
                </Link>
              ))}
              {!sessionUser ? (
                <p className="text-[11px] text-gray-500 pt-1">
                  You will be prompted to sign in before entering a portal.
                </p>
              ) : null}
            </div>
          </details>
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
            <Link
              href="/admissions"
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