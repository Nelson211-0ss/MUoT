'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  UsersRound,
  IdCard,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
  CreditCard,
  Building2,
  PieChart,
  Globe,
  SlidersHorizontal,
  ShieldCheck,
  BookMarked,
  Award,
  CalendarClock,
  Bell,
  Shield,
  ScrollText,
} from 'lucide-react'

import EcosystemPlaceholder from '@/components/portals/EcosystemPlaceholder'
import AdmissionManagementWorkspace from '@/components/admissions/AdmissionManagementWorkspace'
import { MANAGEMENT_ROLE_SLUGS } from '@/lib/rbac/constants'
import { P } from '@/lib/rbac/constants'

const SECTION_DEFS = [
  {
    id: 'overview',
    label: 'Dashboard',
    icon: LayoutDashboard,
    requireAny: [P.MANAGEMENT_DASHBOARD],
  },
  {
    id: 'people',
    label: 'Users & staffing',
    icon: UsersRound,
    requireAny: [P.USERS_VIEW, P.USERS_MANAGE],
  },
  {
    id: 'directory',
    label: 'Directory',
    icon: IdCard,
    requireAny: [P.DIRECTORY_VIEW],
  },
  {
    id: 'admissions',
    label: 'Admissions',
    icon: GraduationCap,
    requireAny: [
      P.ADMISSIONS_VIEW,
      P.ADMISSIONS_MANAGE,
      P.ADMISSIONS_PIPELINE_VIEW,
      P.ADMISSIONS_APPLICATION_REVIEW,
      P.ADMISSIONS_ANALYTICS_VIEW,
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: CreditCard,
    requireAny: [P.FINANCE_VIEW, P.FINANCE_MANAGE],
  },
  {
    id: 'departments',
    label: 'Departments',
    icon: Building2,
    requireAny: [P.DEPARTMENTS_MANAGE],
  },
  {
    id: 'programs',
    label: 'Programs',
    icon: BookMarked,
    requireAny: [P.PROGRAMS_MANAGE],
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Award,
    requireAny: [P.CERTIFICATES_MANAGE],
  },
  {
    id: 'timetable',
    label: 'Timetable',
    icon: CalendarClock,
    requireAny: [P.TIMETABLE_MANAGE],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: PieChart,
    requireAny: [P.REPORTS_VIEW],
  },
  {
    id: 'cms',
    label: 'Website CMS',
    icon: Globe,
    requireAny: [P.CMS_MANAGE],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    requireAny: [P.NOTIFY_MANAGE],
  },
  {
    id: 'audit',
    label: 'Audit logs',
    icon: ScrollText,
    requireAny: [P.AUDIT_VIEW],
  },
  {
    id: 'rbac',
    label: 'RBAC control',
    icon: ShieldCheck,
    requireAny: [P.RBAC_MANAGE],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SlidersHorizontal,
    requireAny: [P.SETTINGS_VIEW, P.SETTINGS_MANAGE],
  },
]

export default function AdminDashboard({
  viewer = null,
  users,
  permissionKeys = [],
  viewerRole = 'ADMIN',
}) {
  const router = useRouter()
  const [msg, setMsg] = useState(null)
  const [section, setSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [auditLogs, setAuditLogs] = useState([])
  const [auditLoading, setAuditLoading] = useState(false)

  const lecturers = users.filter((u) => u.role === 'LECTURER')
  const students = users.filter((u) => u.role === 'STUDENT')
  const staffCount = users.filter((u) => MANAGEMENT_ROLE_SLUGS.has(u.role)).length

  const allow = (...keys) => keys.some((k) => permissionKeys.includes(k))

  const sections = useMemo(
    () => SECTION_DEFS.filter((def) => !def.requireAny?.length || def.requireAny.some((k) => permissionKeys.includes(k))),
    [permissionKeys],
  )

  useEffect(() => {
    if (sections.some((s) => s.id === section)) return
    setSection(sections[0]?.id ?? 'overview')
  }, [sections, section])

  useEffect(() => {
    if (section !== 'audit' || !permissionKeys.includes(P.AUDIT_VIEW)) return
    let cancelled = false
    async function load() {
      setAuditLoading(true)
      try {
        const res = await fetch('/api/admin/audit-logs')
        const data = await res.json().catch(() => ({}))
        if (!cancelled && res.ok && Array.isArray(data.logs)) setAuditLogs(data.logs)
      } finally {
        if (!cancelled) setAuditLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [section, permissionKeys])

  function flash(text, ok = true) {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 4500)
  }

  async function createUser(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return flash(data.error || 'Failed', false)
    e.currentTarget.reset()
    flash('User created')
    router.refresh()
  }



  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden min-h-[min(70vh,900px)]">
      <div className="lg:hidden border-b border-gray-200 bg-slate-50 p-3">
        <label className="sr-only" htmlFor="admin-section-mobile">
          Management section
        </label>
        <select
          id="admin-section-mobile"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 bg-white"
          value={sections.some((s) => s.id === section) ? section : sections[0]?.id}
          onChange={(e) => setSection(e.target.value)}
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <aside
        className={`${
          sidebarOpen ? 'lg:w-60 xl:w-64' : 'lg:w-[4.25rem]'
        } shrink-0 bg-primary text-white flex flex-col transition-[width] duration-200 ease-out`}
      >
        <div className="hidden lg:flex items-center justify-between gap-2 px-3 py-4 border-b border-white/10">
          {sidebarOpen ? (
            <p className="text-xs font-bold uppercase tracking-wider text-white/90 pl-1">Operations</p>
          ) : (
            <span className="sr-only">Management menu</span>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <PanelLeft className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <nav className="hidden lg:flex flex-col gap-1 p-2 flex-1 overflow-y-auto max-h-[70vh]">
          {sections.map((s) => {
            const Icon = s.icon
            const active = section === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                title={!sidebarOpen ? s.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                  active ? 'bg-white text-primary shadow-sm' : 'text-white/85 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} aria-hidden />
                {sidebarOpen ? <span className="truncate">{s.label}</span> : null}
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 bg-slate-50/80">
        <div className="p-5 sm:p-8 max-w-4xl mx-auto space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex flex-wrap items-center gap-3 text-xs text-gray-700">
            <Shield className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
            <span>
              Signed-in role <strong className="text-primary">{viewerRole}</strong> ·{' '}
              {permissionKeys.length} RBAC scopes resolved for your session via user_roles junction.
            </span>
          </div>

          {msg ? (
            <p
              className={`text-sm px-4 py-3 rounded-xl ${
                msg.ok
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                  : 'bg-red-50 text-red-800 border border-red-100'
              }`}
            >
              {msg.text}
            </p>
          ) : null}

          {section === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-bold text-primary text-xl">Institutional pulse</h2>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  Permission-aware management console aligned with Magwi’s RBAC lattice. Rows below reflect only data
                  scopes you inherit from role assignments.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Users total</p>
                  <p className="text-3xl font-bold text-primary mt-2">{users.length}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Students</p>
                  <p className="text-3xl font-bold text-primary mt-2">{students.length}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lecturers</p>
                  <p className="text-3xl font-bold text-primary mt-2">{lecturers.length}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Moodle LMS</p>
                  <p className="text-sm font-semibold text-primary mt-2 leading-snug">
                    Curriculum delivery
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Configure campus link via NEXT_PUBLIC_MOODLE_URL · no local mirror.</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm flex flex-wrap gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Elevated roles on campus:</span> {staffCount}
                </div>
              </div>
            </div>
          )}

          {section === 'people' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-bold text-primary text-xl">Accounts</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Provision student and lecturer identities for campus workflows — module rostering and teaching stay in Moodle.
                </p>
              </div>

              {allow(P.USERS_MANAGE) ? (
                <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-primary mb-4">Create user (student or lecturer)</h3>
                  <form onSubmit={createUser} className="grid sm:grid-cols-2 gap-3 max-w-2xl text-sm">
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Full name</label>
                      <input name="name" required minLength={2} className="w-full border rounded-md p-2.5" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
                      <input name="email" type="email" required className="w-full border rounded-md p-2.5" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Temporary password</label>
                      <input name="password" type="password" required minLength={8} className="w-full border rounded-md p-2.5" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Role</label>
                      <select name="role" className="w-full border rounded-md p-2.5" required defaultValue="">
                        <option value="" disabled>
                          Select…
                        </option>
                        <option value="STUDENT">Student</option>
                        <option value="LECTURER">Lecturer</option>
                      </select>
                    </div>
                    <button type="submit" className="sm:col-span-2 bg-primary text-white font-bold py-2.5 rounded-md hover:opacity-90">
                      Create account
                    </button>
                  </form>
                </section>
              ) : null}

              {!allow(P.USERS_VIEW) && !allow(P.USERS_MANAGE) && (
                <p className="text-sm text-gray-600 border border-dashed rounded-xl p-4">
                  Directory-only staff may view users through the Directory tab rather than provisioning here.
                </p>
              )}

            </div>
          )}

          {section === 'directory' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-bold text-primary text-xl">Campus-wide directory</h2>
                <p className="text-sm text-gray-600 mt-1">Filtered by RBAC scopes — identities stay isolated per GDPR-style policy.</p>
              </div>
              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="overflow-x-auto border border-gray-100 rounded-lg max-h-[min(60vh,520px)] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0 text-left uppercase text-gray-500">
                      <tr>
                        <th className="px-2 py-2">Email</th>
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="px-2 py-1.5 text-gray-800">{u.email}</td>
                          <td className="px-2 py-1.5">{u.name}</td>
                          <td className="px-2 py-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 font-semibold ${
                                MANAGEMENT_ROLE_SLUGS.has(u.role)
                                  ? 'bg-purple-100 text-purple-900'
                                  : u.role === 'LECTURER'
                                    ? 'bg-sky-100 text-sky-900'
                                    : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {section === 'admissions' && (
            <AdmissionManagementWorkspace
              viewer={viewer}
              permissionKeys={permissionKeys}
            />
          )}

          {section === 'finance' && (
            <EcosystemPlaceholder
              title="Finance & cashiering"
              description={`Ledger visibility: ${allow(P.FINANCE_MANAGE) ? 'Operational controls enabled.' : 'Read-only treasury snapshot.'}`}
            />
          )}

          {section === 'departments' && (
            <EcosystemPlaceholder
              title="Departments"
              description="Workload planning and delegated approvals synced with departmental RBAC checkpoints."
            />
          )}

          {section === 'programs' && (
            <EcosystemPlaceholder title="Programs" description="Approve degree structures and align curriculum governance." />
          )}

          {section === 'certificates' && (
            <EcosystemPlaceholder title="Certificates issuance" description="Controlled flows for attestations tied to registrar sign-off rails." />
          )}

          {section === 'timetable' && (
            <EcosystemPlaceholder title="Master timetable" description="Conflict detection, venues, hybrids, registrar locks." />
          )}

          {section === 'reports' && (
            <EcosystemPlaceholder
              title="Reports"
              description="Council-ready attainment packs gated by institutional analytics roles."
            />
          )}

          {section === 'cms' && (
            <EcosystemPlaceholder title="Website CMS" description="Headless editorial + compliance previews for MUoT outward presence." />
          )}

          {section === 'notifications' && (
            <EcosystemPlaceholder title="Enterprise notifications" description="Audience segmentation respecting privacy boundaries." />
          )}

          {section === 'audit' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-primary text-xl">Audit trail</h2>
                <p className="text-sm text-gray-600 mt-1">Immutable instrumentation for SOC-style reviews.</p>
              </div>
              {auditLoading ? (
                <p className="text-sm text-gray-500">Loading events…</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm max-h-[440px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0 text-left uppercase text-gray-500">
                      <tr>
                        <th className="px-2 py-2">When</th>
                        <th className="px-2 py-2">Action</th>
                        <th className="px-2 py-2">Actor</th>
                        <th className="px-2 py-2">Resource</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-2 py-4 text-gray-500 text-center">
                            No audit entries yet — successful logins and admin mutations appear here automatically.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((row) => (
                          <tr key={row.id}>
                            <td className="px-2 py-1.5 whitespace-nowrap text-gray-700">
                              {new Date(row.createdAt).toLocaleString()}
                            </td>
                            <td className="px-2 py-1.5 font-semibold text-primary">{row.action}</td>
                            <td className="px-2 py-1.5">
                              {row.actor ? `${row.actor.name}` : <span className="text-gray-400">Anonymous</span>}
                              <div className="text-gray-500">{row.actor?.email ?? '—'}</div>
                            </td>
                            <td className="px-2 py-1.5 text-gray-600">{row.resource}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {section === 'rbac' && (
            <EcosystemPlaceholder
              title="RBAC authoring"
              description="Role-to-permutation editing, segregation-of-duty templates, impersonation safeguards—elevated SUPER_ADMIN tooling lands here shortly."
              footnote="Today: permissions live in prisma/rbac-matrix.cjs synced through seed migrations."
            />
          )}

          {section === 'settings' && (
            <EcosystemPlaceholder
              title="Institutional settings"
              description="SMTP/SMS, SSO federation, MFA posture, integrations—blocked behind system.settings.manage scopes."
            />
          )}
        </div>
      </div>
    </div>
  )
}
