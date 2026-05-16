import { Inter } from 'next/font/google'
import '@/styles/premium-dashboard.css'
import { PremiumThemeProvider } from '@/components/premium/theme-provider'

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata = {
  title: 'MUT Premium Dashboards',
  description: 'Enterprise UI preview — Magwi University of Technology',
}

export default function PremiumDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} font-sans`}>
      <PremiumThemeProvider>{children}</PremiumThemeProvider>
    </div>
  )
}
