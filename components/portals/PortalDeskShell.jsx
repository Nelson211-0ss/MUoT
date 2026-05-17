'use client'

import { useEffect, useState } from 'react'
import { Bell, Menu, Search, X } from 'lucide-react'

import Logo from '@/components/Logo'

/** Compact nav link styles — fits full sidebar without internal scroll. */
export function deskNavLinkClass(active) {
  return [
    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium leading-tight transition-all',
    active
      ? 'bg-primary text-white'
      : 'text-slate-600 hover:bg-slate-100',
  ].join(' ')
}

/** Shared light-mode dashboard chrome for applicant & admissions desks. */
export default function PortalDeskShell({
  badgeTitle,
  badgeSubtitle = '',
  headerTitle,
  headerDescription = '',
  sidebar,
  footer = null,
  headerExtra = null,
  children,
  mainInnerClassName = 'mx-auto w-full max-w-5xl',
  showSearch = true,
}) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeMobile()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const sidebarPanel = (
    <>
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200 bg-white px-3">
        <Logo className="h-8 w-8 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-primary">{badgeTitle}</p>
          {badgeSubtitle ? (
            <p className="truncate text-[9px] font-medium text-slate-500">{badgeSubtitle}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={closeMobile}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-2.5 py-2">
        {sidebar(closeMobile)}
      </nav>

      {footer ? <div className="mt-auto shrink-0 space-y-1.5 border-t border-slate-100 p-2.5">{footer}</div> : null}
    </>
  )

  return (
    <div data-portal-scope="light" data-desk-shell className="flex h-dvh overflow-hidden bg-slate-50 text-slate-900">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={closeMobile}
          aria-label="Close navigation"
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(18rem,88vw)] flex-col border-r border-slate-200/90 bg-white transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[15rem] lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {sidebarPanel}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 shrink-0 border-b border-slate-200 bg-white">
          <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-6">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">
                {headerTitle}
              </h1>
              {headerDescription ? (
                <p className="hidden truncate text-xs text-slate-500 sm:block">{headerDescription}</p>
              ) : null}
            </div>
            {headerExtra}
            <div className="relative shrink-0">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                onClick={() => setNotifOpen((o) => !o)}
              >
                <Bell className="h-5 w-5" strokeWidth={1.75} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary ring-2 ring-white" />
              </button>
              {notifOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 lg:hidden"
                    aria-label="Close notifications"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <p className="mt-1 text-xs text-slate-500">Open your inbox from the sidebar for full history.</p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          {showSearch ? (
            <div className="border-t border-slate-100 px-3 py-2 sm:px-6">
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search this desk…"
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          ) : null}
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
          <div className={mainInnerClassName}>{children}</div>
        </main>
      </div>
    </div>
  )
}
