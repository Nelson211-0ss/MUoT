'use client'

import * as React from 'react'
import { DashboardShell } from '@/components/premium/shell/dashboard-shell'
import { PREMIUM_ROLES, type PremiumRoleSlug } from '@/lib/premium/role-config'
import {
  AdmissionsOfficerView,
  ApplicantView,
  DepartmentAdminView,
  FinanceOfficerView,
  HodView,
  LecturerView,
  RegistrarView,
  StudentView,
  SuperAdminView,
  SystemAdminView,
} from '@/components/premium/dashboards/role-views'

const VIEWS: Record<PremiumRoleSlug, React.ComponentType> = {
  'super-admin': SuperAdminView,
  admin: SystemAdminView,
  admissions: AdmissionsOfficerView,
  applicant: ApplicantView,
  student: StudentView,
  'department-admin': DepartmentAdminView,
  finance: FinanceOfficerView,
  hod: HodView,
  lecturer: LecturerView,
  registrar: RegistrarView,
}

export function RoleDashboard({ roleSlug }: { roleSlug: PremiumRoleSlug }) {
  const role = PREMIUM_ROLES[roleSlug]
  const View = VIEWS[roleSlug]
  return (
    <DashboardShell role={role}>
      <View />
    </DashboardShell>
  )
}
