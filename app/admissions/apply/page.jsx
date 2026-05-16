import { redirect } from 'next/navigation'

/** Public entry mapped from marketing funnels straight into SSO + dossier wizard. */
export default function AdmissionsApplyLanding() {
  redirect('/login?intent=applicant&next=/applicant-portal/application')
}
