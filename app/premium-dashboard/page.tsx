import Link from 'next/link'
import { PREMIUM_ROLE_LIST } from '@/lib/premium/role-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'

export default function PremiumDashboardHubPage() {
  return (
    <div className="premium-dashboard min-h-dvh bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Badge className="mb-4">UI preview only · no backend</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Magwi University
          <span className="block text-indigo-600 dark:text-indigo-400">Premium dashboards</span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          Enterprise-grade role dashboards inspired by Linear, Stripe, and Vercel. Select a persona to preview the full
          shell, analytics, and widgets.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {PREMIUM_ROLE_LIST.map((role) => (
            <Link key={role.slug} href={`/premium-dashboard/${role.slug}`}>
              <Card className="group h-full transition-all hover:border-indigo-300 hover:shadow-lg dark:hover:border-indigo-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    {role.title}
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                  </CardTitle>
                  <CardDescription>{role.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-xs text-slate-500">{role.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {role.badge}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
