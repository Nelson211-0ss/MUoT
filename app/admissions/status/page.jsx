import Link from 'next/link'
import PageLayout from '@/components/PageLayout'

export default function AdmissionStatusLanding() {
  return (
    <PageLayout title="Application status hub" subtitle="Magwi Admissions Office · SSO tracking only." showCta={false}>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Admissions desks surface rich timelines, clerk notes, tuition escalations and document callbacks inside your
            dedicated Applicant workspace—never over raw email attachments.
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Authenticate with Applicant SSO.</li>
            <li>Open your dashboard pulse + notifications.</li>
            <li>Cross-check Admissions comments + finance levies inline.</li>
          </ol>
        </div>
        <Link
          href="/login?intent=applicant&next=%2Fapplicant-portal"
          className="rounded-3xl bg-primary dark:bg-secondary/90 text-secondary dark:text-primary p-10 text-center shadow-lg font-bold text-xl hover:opacity-95"
        >
          Sign in · applicant portal →
        </Link>
      </div>
    </PageLayout>
  )
}
