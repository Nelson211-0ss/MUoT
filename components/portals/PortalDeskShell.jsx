'use client'

import { useState } from 'react'
import { Menu, PanelLeftClose } from 'lucide-react'

import Logo from '@/components/Logo'

/** @typedef {{ closeMobile: () => void }} SidebarApi */

/**
 * Shared light-mode dashboard chrome (aligned with Applicant Portal).
 *
 * @param {{
 *   badgeTitle: string
 *   badgeSubtitle?: string
 *   headerTitle: string
 *   sidebar: (closeMobile: () => void) => import('react').ReactNode
 *   footer?: import('react').ReactNode | null
 *   children: import('react').ReactNode
 *   mainInnerClassName?: string
 * }} props
 */
export default function PortalDeskShell({
  badgeTitle,
  badgeSubtitle = '',
  headerTitle,
  sidebar,
  footer = null,
  children,
  mainInnerClassName = 'mx-auto w-full max-w-5xl',
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeMobile = () => setSidebarOpen(false)

  return (
    <div data-portal-scope="light" className="flex min-h-dvh bg-slate-50 text-slate-900">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[min(17.5rem,_88vw)] flex-col border-r border-slate-200/90 bg-white transition-transform lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-14 items-center gap-3 border-b border-slate-100 px-4">
          <Logo className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-primary">{badgeTitle}</p>
            {badgeSubtitle ? (
              <p className="truncate text-[10px] font-medium text-slate-500">{badgeSubtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={closeMobile}
          >
            <PanelLeftClose className="h-5 w-5" aria-hidden strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">{sidebar(closeMobile)}</nav>

        {footer ? <div className="space-y-2 border-t border-slate-100 p-3">{footer}</div> : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md lg:px-6">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden strokeWidth={1.75} />
          </button>
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-slate-900">{headerTitle}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className={mainInnerClassName}>{children}</div>
        </main>
      </div>
    </div>
  )
}
