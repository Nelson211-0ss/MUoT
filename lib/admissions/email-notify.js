import { sendTransactionalMail } from '@/lib/mail/outbound'

/**
 * Sent when admissions clears an applicant toward acceptance (provisional offer + fee intent).
 *
 * @param {{ email: string; fullName?: string | null; programName?: string | null }} p
 */
export async function notifyApplicantAdmittedOutbound(p) {
  const name = String(p.fullName ?? 'Applicant').trim() || 'Applicant'
  const program = String(p.programName ?? '').trim() || 'your selected programme'

  const text = [
    `Dear ${name.split(/\s+/)[0] ?? 'Applicant'},`,
    '',
    `Congratulations — Admissions at Magwi University of Technology has decided to admit you (${program}).`,
    '',
    'Next steps:',
    '- Sign in to your applicant portal and open Payments to complete any acceptance levy or registration fee when prompted.',
    '- Watch your in-app Notifications for registrar messages.',
    '',
    'Welcome to MUoT.',
    '',
    'Magwi University of Technology',
    'Admissions Office',
  ].join('\n')

  return sendTransactionalMail({
    to: p.email,
    subject: 'You have been admitted — Magwi University of Technology',
    text,
  })
}

/**
 * Sent when the registrar workflow issues a learner number / student SSO.
 *
 * @param {{ email: string; fullName?: string | null; studentLoginNumber: string }} p
 */
export async function notifyApplicantEnrolledOutbound(p) {
  const name = String(p.fullName ?? 'Student').trim() || 'Student'
  const digits = String(p.studentLoginNumber).trim()

  const text = [
    `Dear ${name.split(/\s+/)[0] ?? 'Student'},`,
    '',
    'Your admission is complete — you now have official student credentials in the MUoT portal.',
    '',
    `Your 10-digit student login number is: ${digits}`,
    '- On first sign-in use this number as BOTH your username and password, then choose a permanent password.',
    '- After that sign in via the unified login with your learner number or your email address.',
    '',
    'Course delivery continues in Moodle once your programme desk syncs LMS access.',
    '',
    'Magwi University of Technology',
    'Registrar · Admissions Systems',
  ].join('\n')

  return sendTransactionalMail({
    to: p.email,
    subject: `Your MUoT student number is ${digits}`,
    text,
  })
}
