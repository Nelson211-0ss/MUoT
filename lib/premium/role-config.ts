import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Shield,
  GraduationCap,
  Wallet,
  Building2,
  BookOpen,
  ClipboardList,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Server,
  Activity,
  Calendar,
  Upload,
  CreditCard,
  LineChart,
  UserCheck,
  Layers,
} from 'lucide-react'

export type PremiumRoleSlug =
  | 'super-admin'
  | 'admin'
  | 'admissions'
  | 'applicant'
  | 'student'
  | 'department-admin'
  | 'finance'
  | 'hod'
  | 'lecturer'
  | 'registrar'

export type NavItem = { label: string; href: string; icon: LucideIcon }

export type RoleMeta = {
  slug: PremiumRoleSlug
  title: string
  subtitle: string
  email: string
  badge: string
  nav: NavItem[]
}

const base = (slug: PremiumRoleSlug) => `/premium-dashboard/${slug}`

export const PREMIUM_ROLES: Record<PremiumRoleSlug, RoleMeta> = {
  'super-admin': {
    slug: 'super-admin',
    title: 'Super Administrator',
    subtitle: 'Global university command center',
    email: 'super@mut.edu',
    badge: 'SUPER_ADMIN',
    nav: [
      { label: 'Overview', href: base('super-admin'), icon: LayoutDashboard },
      { label: 'Analytics', href: `${base('super-admin')}#analytics`, icon: BarChart3 },
      { label: 'Users', href: `${base('super-admin')}#users`, icon: Users },
      { label: 'Security', href: `${base('super-admin')}#security`, icon: Shield },
      { label: 'Audit logs', href: `${base('super-admin')}#audit`, icon: FileText },
      { label: 'Announcements', href: `${base('super-admin')}#announcements`, icon: Bell },
      { label: 'Settings', href: `${base('super-admin')}#settings`, icon: Settings },
    ],
  },
  admin: {
    slug: 'admin',
    title: 'System Administrator',
    subtitle: 'Infrastructure & platform operations',
    email: 'admin@mut.edu',
    badge: 'ADMIN',
    nav: [
      { label: 'Overview', href: base('admin'), icon: LayoutDashboard },
      { label: 'Users', href: `${base('admin')}#users`, icon: Users },
      { label: 'Access control', href: `${base('admin')}#access`, icon: Shield },
      { label: 'System health', href: `${base('admin')}#health`, icon: Server },
      { label: 'API monitor', href: `${base('admin')}#api`, icon: Activity },
      { label: 'Tickets', href: `${base('admin')}#tickets`, icon: ClipboardList },
      { label: 'Settings', href: `${base('admin')}#settings`, icon: Settings },
    ],
  },
  admissions: {
    slug: 'admissions',
    title: 'Admissions Officer',
    subtitle: 'Applicant pipeline & intake analytics',
    email: 'admissions@mut.edu',
    badge: 'ADMISSIONS',
    nav: [
      { label: 'Pipeline', href: base('admissions'), icon: LayoutDashboard },
      { label: 'Applications', href: `${base('admissions')}#applications`, icon: ClipboardList },
      { label: 'Interviews', href: `${base('admissions')}#interviews`, icon: Calendar },
      { label: 'Analytics', href: `${base('admissions')}#analytics`, icon: BarChart3 },
      { label: 'Intakes', href: `${base('admissions')}#intakes`, icon: Layers },
    ],
  },
  applicant: {
    slug: 'applicant',
    title: 'Applicant Portal',
    subtitle: 'Your admission journey at MUT',
    email: 'applicant@mut.edu',
    badge: 'APPLICANT',
    nav: [
      { label: 'Dashboard', href: base('applicant'), icon: LayoutDashboard },
      { label: 'Application', href: `${base('applicant')}#application`, icon: FileText },
      { label: 'Documents', href: `${base('applicant')}#documents`, icon: Upload },
      { label: 'Payments', href: `${base('applicant')}#payments`, icon: CreditCard },
      { label: 'Timeline', href: `${base('applicant')}#timeline`, icon: Activity },
    ],
  },
  student: {
    slug: 'student',
    title: 'Student Portal',
    subtitle: 'Academic life & learning hub',
    email: 'demo@mut.edu',
    badge: 'STUDENT',
    nav: [
      { label: 'Dashboard', href: base('student'), icon: LayoutDashboard },
      { label: 'Courses', href: `${base('student')}#courses`, icon: BookOpen },
      { label: 'Assignments', href: `${base('student')}#assignments`, icon: ClipboardList },
      { label: 'Fees', href: `${base('student')}#fees`, icon: Wallet },
      { label: 'Results', href: `${base('student')}#results`, icon: LineChart },
    ],
  },
  'department-admin': {
    slug: 'department-admin',
    title: 'Department Administrator',
    subtitle: 'Faculty operations & course allocation',
    email: 'dept@mut.edu',
    badge: 'DEPT_ADMIN',
    nav: [
      { label: 'Overview', href: base('department-admin'), icon: LayoutDashboard },
      { label: 'Lecturers', href: `${base('department-admin')}#lecturers`, icon: Users },
      { label: 'Courses', href: `${base('department-admin')}#courses`, icon: BookOpen },
      { label: 'Attendance', href: `${base('department-admin')}#attendance`, icon: UserCheck },
      { label: 'Analytics', href: `${base('department-admin')}#analytics`, icon: BarChart3 },
    ],
  },
  finance: {
    slug: 'finance',
    title: 'Finance Officer',
    subtitle: 'Tuition, revenue & scholarship desk',
    email: 'finance@mut.edu',
    badge: 'FINANCE',
    nav: [
      { label: 'Overview', href: base('finance'), icon: LayoutDashboard },
      { label: 'Payments', href: `${base('finance')}#payments`, icon: CreditCard },
      { label: 'Invoices', href: `${base('finance')}#invoices`, icon: FileText },
      { label: 'Scholarships', href: `${base('finance')}#scholarships`, icon: GraduationCap },
      { label: 'Reports', href: `${base('finance')}#reports`, icon: BarChart3 },
    ],
  },
  hod: {
    slug: 'hod',
    title: 'Head of Department',
    subtitle: 'Department performance & curriculum',
    email: 'hod@mut.edu',
    badge: 'HOD',
    nav: [
      { label: 'Overview', href: base('hod'), icon: LayoutDashboard },
      { label: 'Lecturers', href: `${base('hod')}#lecturers`, icon: Users },
      { label: 'Courses', href: `${base('hod')}#courses`, icon: BookOpen },
      { label: 'Performance', href: `${base('hod')}#performance`, icon: BarChart3 },
      { label: 'Research', href: `${base('hod')}#research`, icon: Layers },
    ],
  },
  lecturer: {
    slug: 'lecturer',
    title: 'Lecturer Portal',
    subtitle: 'Teaching, grading & class analytics',
    email: 'lecturer@mut.edu',
    badge: 'LECTURER',
    nav: [
      { label: 'Dashboard', href: base('lecturer'), icon: LayoutDashboard },
      { label: 'Courses', href: `${base('lecturer')}#courses`, icon: BookOpen },
      { label: 'Grading', href: `${base('lecturer')}#grading`, icon: ClipboardList },
      { label: 'Attendance', href: `${base('lecturer')}#attendance`, icon: UserCheck },
      { label: 'Materials', href: `${base('lecturer')}#materials`, icon: Upload },
    ],
  },
  registrar: {
    slug: 'registrar',
    title: 'Academic Registrar',
    subtitle: 'Records, transcripts & examinations',
    email: 'registrar@mut.edu',
    badge: 'REGISTRAR',
    nav: [
      { label: 'Overview', href: base('registrar'), icon: LayoutDashboard },
      { label: 'Admissions', href: `${base('registrar')}#admissions`, icon: GraduationCap },
      { label: 'Students', href: `${base('registrar')}#students`, icon: Users },
      { label: 'Examinations', href: `${base('registrar')}#exams`, icon: FileText },
      { label: 'Graduation', href: `${base('registrar')}#graduation`, icon: UserCheck },
    ],
  },
}

export const PREMIUM_ROLE_LIST = Object.values(PREMIUM_ROLES)

export function isPremiumRoleSlug(v: string): v is PremiumRoleSlug {
  return v in PREMIUM_ROLES
}
