'use client'

import Link from 'next/link'

export default function ApplicantDocumentsPage() {
  return (
    <div className="max-w-xl space-y-4 text-sm leading-relaxed text-slate-600">
      <p>
        Document uploads happen in{' '}
        <Link href="/applicant-portal/application" prefetch={false} className="font-semibold text-primary hover:underline">
          Application → Documents
        </Link>
        . Admissions MIME rules and versioning apply there.
      </p>
    </div>
  )
}
