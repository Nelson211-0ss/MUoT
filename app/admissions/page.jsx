import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import { CheckCircle } from 'lucide-react'
import AdmissionsForm from '@/components/AdmissionsForm'

const steps = [
  'Complete the online application form below.',
  'Select your preferred program of study.',
  'Submit required documents when requested.',
  'Receive your admission decision via email.',
]

export default function Admissions() {
  return (
    <PageLayout
      title="Admissions"
      subtitle="Take the first step toward your technology career at MUT."
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <div>
          <SectionHeader
            title="How to Apply"
            subtitle="Simple steps to join Magwi University of Technology."
            align="left"
          />
          <ul className="space-y-4">
            {steps.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <CheckCircle className="shrink-0 w-5 h-5 text-secondary mt-0.5" />
                <span className="text-gray-600 text-sm leading-relaxed">
                  <span className="font-semibold text-primary">Step {i + 1}.</span> {step}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <AdmissionsForm />
      </div>
    </PageLayout>
  )
}
