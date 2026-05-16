'use client'

import { useEffect, useMemo, useState } from 'react'
import { GraduationCap, School } from 'lucide-react'

import PortalDeskShell, { deskNavLinkClass } from '@/components/portals/PortalDeskShell'
import LogoutButton from '@/components/LogoutButton'
import AdmissionManagementWorkspace from '@/components/admissions/AdmissionManagementWorkspace'
import { PageHeader } from '@/components/premium-ui/page-header'
import { P } from '@/lib/rbac/constants'

/** @param {{ viewer: object; users: object[]; permissionKeys: string[]; roleLabel: string }} props */
export default function AdmissionsDeskPage({ viewer, users, permissionKeys, roleLabel }) {
  const isRegistrar = viewer?.role === 'ACADEMIC_REGISTRAR'
  const showStudents = permissionKeys.includes(P.STUDENTS_REGISTRY_VIEW)
  const [tab, setTab] = useState('pipeline')

  useEffect(() => {
    if (tab === 'students' && !showStudents) setTab('pipeline')
  }, [tab, showStudents])

  const students = useMemo(() => users.filter((u) => u.role === 'STUDENT'), [users])

  const deskTitle = isRegistrar ? 'Registrar desk' : 'Admissions desk'

  return (
    <PortalDeskShell
      badgeTitle={isRegistrar ? 'Academic registrar' : 'Admissions office'}
      badgeSubtitle="Magwi University of Technology"
      headerTitle={tab === 'students' ? 'Student roster' : deskTitle}
      headerDescription={`${viewer?.name ?? ''} · ${roleLabel}`}
      mainInnerClassName="mx-auto w-full max-w-[90rem]"
      showSearch
      sidebar={(closeMobile) => (
        <>
          <button type="button" onClick={() => { setTab('pipeline'); closeMobile() }} className={deskNavLinkClass(tab === 'pipeline')}>
            <GraduationCap className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Applications
          </button>
          {showStudents ? (
            <button type="button" onClick={() => { setTab('students'); closeMobile() }} className={deskNavLinkClass(tab === 'students')}>
              <School className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              Student roster
            </button>
          ) : null}
        </>
      )}
      footer={
        <LogoutButton className="w-full rounded-lg border border-slate-200 bg-white py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60" />
      }
    >
      {tab === 'pipeline' ? (
        <AdmissionManagementWorkspace viewer={viewer} permissionKeys={permissionKeys} />
      ) : (
        <div className="space-y-6">
          <PageHeader
            title="Enrolled learners"
            description="Students issued MUoT login numbers after registrar enrollment."
          />
          <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            <div className="max-h-[min(70vh,640px)] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Learner login</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                        No enrolled students yet — complete admissions from the Applications tab.
                      </td>
                    </tr>
                  ) : (
                    students.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-mono text-xs text-slate-800">{u.studentLoginNumber ?? '—'}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                        <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </PortalDeskShell>
  )
}
