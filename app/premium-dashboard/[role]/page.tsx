import { notFound } from 'next/navigation'
import { RoleDashboard } from '@/components/premium/dashboards/role-dashboard'
import { isPremiumRoleSlug } from '@/lib/premium/role-config'

export function generateStaticParams() {
  return [
    'super-admin',
    'admin',
    'admissions',
    'applicant',
    'student',
    'department-admin',
    'finance',
    'hod',
    'lecturer',
    'registrar',
  ].map((role) => ({ role }))
}

export default async function PremiumRoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>
}) {
  const { role: roleParam } = await params
  if (!isPremiumRoleSlug(roleParam)) notFound()
  return <RoleDashboard roleSlug={roleParam} />
}
