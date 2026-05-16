/** Role slugs that may open the unified /admin management console (middleware + SSR guards). */

export const MANAGEMENT_ROLE_SLUGS = new Set([
  'ADMIN',
  'SUPER_ADMIN',
  'FINANCE_OFFICER',
  'ADMISSIONS_OFFICER',
  'DEPARTMENT_ADMIN',
  'ACADEMIC_REGISTRAR',
])

/** Dedicated portal role; not part of unified /admin middleware group. */
export const HOD_ROLE_SLUG = 'HOD'

/** Permission keys mirrored for API/route checks (canonical list lives in prisma/rbac-matrix.cjs). */
export const P = /** @type {const} */ ({
  MANAGEMENT_DASHBOARD: 'management.dashboard.view',
  USERS_VIEW: 'management.users.view',
  USERS_MANAGE: 'management.users.manage',
  USERS_DELETE: 'management.users.delete',
  DIRECTORY_VIEW: 'management.directory.view',

  ADMISSIONS_VIEW: 'admissions.view',
  ADMISSIONS_MANAGE: 'admissions.manage',
  ADMISSIONS_PIPELINE_VIEW: 'admissions.pipeline.view',
  ADMISSIONS_APPLICATION_REVIEW: 'admissions.application.review',
  ADMISSIONS_DOCUMENTS_VERIFY: 'admissions.documents.verify',
  ADMISSIONS_REGISTRAR_FINALIZE: 'admissions.registrar.finalize',
  ADMISSIONS_FINANCE_PAYMENT: 'admissions.finance.payment',
  ADMISSIONS_ANALYTICS_VIEW: 'admissions.analytics.view',
  ADMISSIONS_SETTINGS_MANAGE: 'admissions.settings.manage',

  FINANCE_VIEW: 'finance.view',
  FINANCE_MANAGE: 'finance.manage',

  REPORTS_VIEW: 'reports.view',

  DEPARTMENTS_MANAGE: 'academics.departments.manage',
  PROGRAMS_MANAGE: 'academics.programs.manage',
  CERTIFICATES_MANAGE: 'academics.certificates.manage',
  TIMETABLE_MANAGE: 'academics.timetable.manage',

  CMS_MANAGE: 'cms.manage',
  NOTIFY_MANAGE: 'communications.notifications.manage',

  SETTINGS_VIEW: 'system.settings.view',
  SETTINGS_MANAGE: 'system.settings.manage',

  RBAC_MANAGE: 'system.rbac.manage',
  AUDIT_VIEW: 'system.audit.view',
  INFRA_MANAGE: 'infrastructure.manage',

  LECTURER_PORTAL: 'lecturer.portal.access',

  HOD_PORTAL: 'hod.portal.access',
  HOD_UNITS_MANAGE: 'hod.units.manage',
  HOD_GRADES_RECORD: 'hod.grades.record',
})

export function normalizeRoleSlug(slug) {
  return String(slug ?? '')
    .trim()
    .toUpperCase()
}

export function isManagementRoleSlug(slug) {
  return MANAGEMENT_ROLE_SLUGS.has(normalizeRoleSlug(slug))
}

export function isHoDRoleSlug(slug) {
  return normalizeRoleSlug(slug) === normalizeRoleSlug(HOD_ROLE_SLUG)
}
