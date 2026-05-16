'use client'

import Link from 'next/link'

import PageLayout from '@/components/PageLayout'
import ApplicantPortalShell from '@/components/applicant-portal/ApplicantPortalShell'

export default function ApplicantDocumentsPage() {
  return (
    <PageLayout title="Supporting documents" subtitle="Secure ingestion for dossier artefacts." showCta={false}>
      <ApplicantPortalShell>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
          Consolidated uploads live directly inside{' '}
          <Link href="/applicant-portal/application" prefetch={false} className="font-semibold text-primary dark:text-secondary">
            My Application → Documents stage
          </Link>
          . That screen enforces Admissions&apos; MIME allowlists and versioning for transcripts, IDs and certificates.
        </p>
      </ApplicantPortalShell>
    </PageLayout>
  )
}
