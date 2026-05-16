import { redirect } from 'next/navigation'

import { getSessionFromCookies } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { isHoDRoleSlug, isManagementRoleSlug, normalizeRoleSlug } from '@/lib/rbac/constants'

const APPLICANT_REGISTER_LOGIN = '/login?intent=applicant&register=1&next=/applicant-portal/application'
const APPLICANT_SIGNIN_LOGIN = '/login?intent=applicant&next=/applicant-portal/application'

/**
 * Undergraduate apply funnel: applicant account is required before the wizard.
 * Guests are sent to registration; authenticated applicants go straight to the dossier.
 */
export default async function AdmissionsApplyLanding() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect(APPLICANT_REGISTER_LOGIN)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  })
  if (!user) {
    redirect(APPLICANT_REGISTER_LOGIN)
  }

  const slug = normalizeRoleSlug(user.role ?? '')
  if (slug === 'APPLICANT') {
    redirect('/applicant-portal/application')
  }
  if (slug === 'STUDENT') {
    redirect('/student-portal?tab=admissions')
  }
  if (isManagementRoleSlug(slug)) {
    redirect('/admin')
  }
  if (slug === 'LECTURER') {
    redirect('/lecturer-portal')
  }
  if (isHoDRoleSlug(slug)) {
    redirect('/hod-portal')
  }

  redirect(APPLICANT_SIGNIN_LOGIN)
}
