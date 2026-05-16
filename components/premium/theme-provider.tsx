'use client'

import * as React from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function PremiumThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>('light')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = window.localStorage.getItem('mut-premium-theme') as Theme | null
    if (stored === 'dark' || stored === 'light') setTheme(stored)
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('mut-premium-theme', theme)
  }, [theme, mounted])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function usePremiumTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('usePremiumTheme must be used within PremiumThemeProvider')
  return ctx
}
