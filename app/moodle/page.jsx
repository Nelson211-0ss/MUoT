import { redirect } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import MoodleHubCallout from '@/components/MoodleHubCallout'

export const metadata = {
  title: 'Moodle LMS | Magwi University of Technology',
  description:
    'Access the institutional Moodle workspace for lessons, quizzes, assignments, forums, grades, and course resources.',
}

export default function MoodleLauncherPage() {
  const moodleUrl = typeof process.env.NEXT_PUBLIC_MOODLE_URL === 'string' ? process.env.NEXT_PUBLIC_MOODLE_URL.trim() : ''

  if (moodleUrl) {
    redirect(moodleUrl)
  }

  return (
    <PageLayout title="Moodle LMS" subtitle="Course delivery happens here — MUoT web provides identity & governance only.">
      <MoodleHubCallout />
      <p className="mt-6 text-sm text-gray-600 max-w-2xl leading-relaxed">
        When ICT provisions <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_MOODLE_URL</code> in your
        deployment environment this page redirects automatically before students see anything else.
      </p>
    </PageLayout>
  )
}
