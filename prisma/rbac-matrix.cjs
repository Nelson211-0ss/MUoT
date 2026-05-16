/** Source of truth for RBAC seed: permissions, roles, and role→permission tuples (role slug → permission.key). */

const permissions = [
  // Management / admin shell
  { key: 'management.dashboard.view', name: 'View management dashboard' },
  { key: 'management.users.view', name: 'View directory of users' },
  { key: 'management.users.manage', name: 'Create and suspend users' },
  { key: 'management.users.delete', name: 'Delete user accounts' },
  { key: 'management.directory.view', name: 'View academic directory' },
  { key: 'management.students.registry.view', name: 'Registrar: view enrolled student roster' },

  { key: 'admissions.view', name: 'View admission applications' },
  { key: 'admissions.manage', name: 'Process applications & letters' },

  { key: 'finance.view', name: 'View tuition and payments' },
  { key: 'finance.manage', name: 'Verify payments & tuition settings' },
  { key: 'finance.reports', name: 'Export finance reports' },

  { key: 'academics.departments.manage', name: 'Manage departments' },
  { key: 'academics.programs.manage', name: 'Manage academic programs' },
  { key: 'academics.certificates.manage', name: 'Manage certificates issuance' },
  { key: 'academics.timetable.manage', name: 'Manage master timetable' },

  { key: 'reports.view', name: 'View institutional reports' },
  { key: 'reports.export', name: 'Export analytics datasets' },

  { key: 'cms.manage', name: 'Manage public website CMS' },

  { key: 'communications.notifications.manage', name: 'Campus-wide notifications' },

  { key: 'system.settings.view', name: 'View system settings' },
  { key: 'system.settings.manage', name: 'Change operational settings' },
  { key: 'system.rbac.manage', name: 'Configure RBAC & roles' },
  { key: 'system.audit.view', name: 'View audit logs' },
  { key: 'infrastructure.manage', name: 'Infrastructure & integrations (super)' },

  // Student portal NAV (admissions snapshot, statutory fees, results / CGPA only)
  { key: 'student.nav.dashboard', name: 'Student: Dashboard' },
  { key: 'student.nav.admissions', name: 'Student: Admissions status' },
  { key: 'student.nav.fees', name: 'Student: Fees & tuition' },
  { key: 'student.nav.results', name: 'Student: Results & transcripts' },
  { key: 'student.nav.settings', name: 'Student: Account security' },

  { key: 'hod.portal.access', name: 'Head of department portal' },
  { key: 'hod.units.manage', name: 'HOD: program course units' },
  { key: 'hod.grades.record', name: 'HOD: semester marks entry' },

  // Lecturer portal NAV + teaching APIs (coarse gate)
  { key: 'lecturer.portal.access', name: 'Use lecturer APIs & portal' },
  { key: 'lecturer.nav.dashboard', name: 'Lecturer: Dashboard' },
  { key: 'lecturer.nav.reports', name: 'Lecturer: Teaching reports (read-only excerpts)' },
  { key: 'lecturer.nav.messages', name: 'Lecturer: Messages' },
  { key: 'lecturer.nav.settings', name: 'Lecturer: Settings' },

  { key: 'applicant.nav.dashboard', name: 'Applicant: Dashboard' },
  { key: 'applicant.nav.application', name: 'Applicant: My application' },
  { key: 'applicant.nav.documents', name: 'Applicant: Documents' },
  { key: 'applicant.nav.payments', name: 'Applicant: Payments' },
  { key: 'applicant.nav.notifications', name: 'Applicant: Notifications' },
  { key: 'applicant.nav.profile', name: 'Applicant: Profile' },

  { key: 'admissions.pipeline.view', name: 'View admissions pipeline' },
  { key: 'admissions.application.review', name: 'Review & decide applications' },
  { key: 'admissions.application.manual_record', name: 'Record paper / walk-in applications manually' },
  { key: 'admissions.documents.verify', name: 'Verify applicant documents' },
  { key: 'admissions.registrar.finalize', name: 'Finalize enrollment & IDs' },
  { key: 'admissions.finance.payment', name: 'Verify admission fee payments' },
  { key: 'admissions.analytics.view', name: 'Admissions analytics' },
  { key: 'admissions.settings.manage', name: 'Configure admission catalog' },
]

const HOD_KEYS = ['hod.portal.access', 'hod.units.manage', 'hod.grades.record']

const roles = [
  { slug: 'APPLICANT', name: 'Applicant', description: 'Prospective student (admissions)', level: 5 },
  { slug: 'STUDENT', name: 'Student', description: 'Enrolled learner', level: 10 },
  { slug: 'LECTURER', name: 'Lecturer', description: 'Teaching staff', level: 40 },
  {
    slug: 'HOD',
    name: 'Head of department',
    description: 'Defines program units and records official semester grades',
    level: 45,
  },
  { slug: 'FINANCE_OFFICER', name: 'Finance Officer', description: 'Tuition desk', level: 55 },
  { slug: 'ADMISSIONS_OFFICER', name: 'Admissions Officer', description: 'Applicant processing', level: 55 },
  { slug: 'DEPARTMENT_ADMIN', name: 'Department Administrator', description: 'Departmental academic ops', level: 60 },
  { slug: 'ACADEMIC_REGISTRAR', name: 'Academic Registrar', description: 'Records & programs', level: 70 },
  { slug: 'ADMIN', name: 'System Administrator', description: 'Operational admin', level: 85 },
  { slug: 'SUPER_ADMIN', name: 'Super Administrator', description: 'Full RBAC & infrastructure', level: 100 },
]

const STUDENT_NAV = permissions.filter((p) => p.key.startsWith('student.nav.')).map((p) => p.key)

const LECTURER_KEYS = permissions
  .filter((p) => p.key.startsWith('lecturer.'))
  .map((p) => p.key)

const APPLICANT_KEYS = permissions.filter((p) => p.key.startsWith('applicant.nav.')).map((p) => p.key)

const MANAGEMENT_BASE = ['management.dashboard.view']

const STANDARD_ADMINExtras = [
  'management.users.view',
  'management.users.manage',
  'management.users.delete',
  'management.directory.view',
  'admissions.view',
  'admissions.manage',
  'finance.view',
  'finance.manage',
  'finance.reports',
  'academics.departments.manage',
  'academics.programs.manage',
  'academics.certificates.manage',
  'academics.timetable.manage',
  'reports.view',
  'reports.export',
  'cms.manage',
  'communications.notifications.manage',
  'system.settings.view',
  'system.settings.manage',
  'system.audit.view',
  'admissions.pipeline.view',
  'admissions.application.review',
  'admissions.application.manual_record',
  'admissions.documents.verify',
  'admissions.registrar.finalize',
  'admissions.finance.payment',
  'admissions.analytics.view',
  'admissions.settings.manage',
]

const SUPER_KEYS = [...new Set([...permissions.map((p) => p.key)])]

/** @type {Record<string, string[]>} */
const rolePermissionKeys = {
  APPLICANT: [...APPLICANT_KEYS],

  STUDENT: [...STUDENT_NAV],
  LECTURER: [...LECTURER_KEYS],
  HOD: [...HOD_KEYS],

  FINANCE_OFFICER: [
    ...MANAGEMENT_BASE,
    'finance.view',
    'finance.manage',
    'finance.reports',
    'reports.view',
    'management.directory.view',
    'admissions.pipeline.view',
    'admissions.finance.payment',
  ],

  ADMISSIONS_OFFICER: [
    ...MANAGEMENT_BASE,
    'admissions.view',
    'admissions.manage',
    'admissions.pipeline.view',
    'admissions.application.review',
    'admissions.documents.verify',
    'admissions.registrar.finalize',
    'admissions.analytics.view',
    'reports.view',
    'management.directory.view',
  ],

  DEPARTMENT_ADMIN: [
    ...MANAGEMENT_BASE,
    'management.directory.view',
    'academics.departments.manage',
    'reports.view',
    'management.users.view',
  ],

  ACADEMIC_REGISTRAR: [
    ...MANAGEMENT_BASE,
    'admissions.view',
    'admissions.pipeline.view',
    'admissions.application.review',
    'admissions.registrar.finalize',
    'admissions.application.manual_record',
    'management.students.registry.view',
  ],

  ADMIN: [...new Set([...MANAGEMENT_BASE, ...STANDARD_ADMINExtras])],

  SUPER_ADMIN: SUPER_KEYS,
}

module.exports = { permissions, roles, rolePermissionKeys }
