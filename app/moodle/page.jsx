import PageLayout from '@/components/PageLayout'
import ElearningHub from '@/components/marketing/ElearningHub'

export const metadata = {
  title: 'MUT E-Learning | Magwi University of Technology',
  description:
    'Access the institutional Moodle platform for lessons, quizzes, assignments, forums, grades, and course resources.',
}

export default function MoodleLauncherPage() {
  const moodleUrl = typeof process.env.NEXT_PUBLIC_MOODLE_URL === 'string' ? process.env.NEXT_PUBLIC_MOODLE_URL.trim() : ''

  return (
    <PageLayout
      title="MUT E-Learning"
      subtitle="Course delivery happens here — MUoT web provides identity and governance only."
      showCta={false}
    >
      <ElearningHub moodleUrl={moodleUrl} />
    </PageLayout>
  )
}
