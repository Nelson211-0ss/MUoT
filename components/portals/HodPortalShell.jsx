'use client'

import Link from 'next/link'
import { Building2, ArrowUpRight } from 'lucide-react'

import HodWorkspaceClient from '@/components/portals/HodWorkspaceClient'
import PortalDeskShell from '@/components/portals/PortalDeskShell'
import LogoutButton from '@/components/LogoutButton'

/** @param {{ programs: { id: string; code: string; name: string }[] }} props */
export default function HodPortalShell({ programs }) {
  return (
    <PortalDeskShell
      badgeTitle="HoD desk"
      badgeSubtitle="Programme · units · marks"
      headerTitle="Head of department"
      sidebar={() => (
        <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-3 py-2.5 text-[13px] font-medium text-white shadow-sm">
          <Building2 className="h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
          Department workspace
        </div>
      )}
      footer={
        <>
          <LogoutButton className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60" />
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-1 rounded-xl py-2 text-[12px] font-semibold text-slate-500 hover:text-primary"
          >
            Public site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
          </Link>
        </>
      }
      mainInnerClassName="mx-auto w-full max-w-5xl lg:max-w-6xl"
    >
      <HodWorkspaceClient programs={programs} />
    </PortalDeskShell>
  )
}
