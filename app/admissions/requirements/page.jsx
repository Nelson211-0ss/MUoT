import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'

export default function AdmissionRequirementsPage() {
  const bullets = [
    'SSC / recognised equivalent with proficiency in Mathematics & English.',
    'Certified transcripts and national examination statements (PDF uploads).',
    'Government-issued identification or biometric passport scans.',
    'Two academic or professional referees · recommendation letters welcomed.',
    'English-language readiness — bridge programmes coordinated if needed.',
  ]
  return (
    <PageLayout title="Admission requirements" subtitle="Credential expectations for ICT-first programmes." showCta={false}>
      <SectionHeader
        title="Readiness blueprint"
        subtitle="Applicants upload originals through the dossier wizard; Admissions countersign authenticity."
      />
      <ul className="space-y-3 max-w-3xl text-sm leading-relaxed text-gray-700">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-secondary shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    </PageLayout>
  )
}
