import { NextResponse } from 'next/server'

/**
 * Public self-registration previously created STUDENT accounts; learner provisioning is now admin-only.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Public student signup is disabled. Applicants use Admissions registration; enrolled learners are created by System Administrators.',
    },
    { status: 403 },
  )
}
