'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  Menu,
  Moon,
  PanelLeftClose,
  Search,
  Sun,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { usePremiumTheme } from '@/components/premium/theme-provider'
import type { RoleMeta } from '@/lib/premium/role-config'
import { PREMIUM_ROLE_LIST } from '@/lib/premium/role-config'

export function DashboardShell({
  role,
  children,
}: {
  role: RoleMeta
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { theme, toggle } = usePremiumTheme()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [notifOpen, setNotifOpen] = React.useState(false)

  const initials = role.title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-5 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-[#071c4d] text-xs font-bold text-white shadow-lg shadow-indigo-600/25">
          MUT
        </div>
        {sidebarOpen ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">Magwi University</p>
            <p className="truncate text-[11px] text-slate-500">Smart Portal · UI Preview</p>
          </div>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden lg:inline-flex"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle sidebar"
        >
          <PanelLeftClose className={cn('h-5 w-5 transition-transform', !sidebarOpen && 'rotate-180')} />
        </Button>
        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {role.nav.map((item) => {
          const active =
            pathname === `/premium-dashboard/${role.slug}` &&
            (item.href === `/premium-dashboard/${role.slug}` || item.href.startsWith(`/premium-dashboard/${role.slug}`))
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                !sidebarOpen && 'justify-center px-2',
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              {sidebarOpen ? <span className="truncate">{item.label}</span> : null}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-3 dark:border-slate-800">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Switch role</p>
        <div className="max-h-36 space-y-0.5 overflow-y-auto">
          {PREMIUM_ROLE_LIST.map((r) => (
            <Link
              key={r.slug}
              href={`/premium-dashboard/${r.slug}`}
              className={cn(
                'flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                r.slug === role.slug && 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
              )}
            >
              <span className="truncate">{r.title}</span>
              <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="premium-dashboard flex min-h-dvh">
      {mobileOpen ? (
        <button type="button" className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-transform dark:border-slate-800 dark:bg-slate-950/95 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          !sidebarOpen && 'lg:w-[4.5rem]',
        )}
      >
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{role.title}</p>
            <p className="truncate text-xs text-slate-500">{role.subtitle}</p>
          </div>
          <div className="relative mx-auto w-full max-w-md flex-1 sm:mx-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search portal…" className="h-10 pl-9" />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setNotifOpen((o) => !o)} aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
              <AnimatePresence>
                {notifOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="text-sm font-semibold">Notifications</p>
                    <p className="mt-2 text-xs text-slate-500">3 unread · UI preview only</p>
                    <ul className="mt-3 space-y-2 text-xs">
                      <li className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">New application submitted</li>
                      <li className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">Payment verified — Finance</li>
                      <li className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">System backup completed</li>
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-2 py-1 dark:border-slate-800 sm:flex">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{role.email}</p>
                <Badge variant="secondary" className="mt-0.5 text-[10px]">
                  {role.badge}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={role.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-[1400px] space-y-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

