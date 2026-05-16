import { redirect } from 'next/navigation'

/** Historic URL — catalogue and teaching modules live in Moodle. */
export default function CoursesLegacyRedirectPage() {
  redirect('/moodle')
}
