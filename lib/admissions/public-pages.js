/** Shared copy & nav for public admissions marketing pages. */

export const ADMISSIONS_NAV = [
  { href: '/admissions', label: 'Overview' },
  { href: '/admissions/requirements', label: 'Requirements' },
  { href: '/admissions/tuition', label: 'Tuition & fees' },
  { href: '/admissions/scholarships', label: 'Scholarships' },
  { href: '/admissions/faqs', label: 'FAQs' },
  { href: '/admissions/status', label: 'Track application' },
]

export const ADMISSIONS_PROCESS = [
  {
    title: 'Create applicant account',
    description: 'Register with email, verify contact details, and receive secure SSO credentials.',
  },
  {
    title: 'Complete the dossier wizard',
    description: 'Select programme & intake, upload credentials, and submit for desk review.',
  },
  {
    title: 'Provisional decision & payment',
    description: 'Admissions reviews your file; acceptance levy is verified before enrollment.',
  },
  {
    title: 'Registrar enrollment',
    description: 'Receive your learner number and transition to the student portal when cleared.',
  },
]

export const ADMISSIONS_STATS = [
  { label: 'Review target', value: '14 days', hint: 'After complete submission' },
  { label: 'Programmes', value: 'ICT-first', hint: 'Engineering & applied computing' },
  { label: 'Document vault', value: 'Secure', hint: 'MIME-checked uploads' },
  { label: 'Support', value: 'Desk + portal', hint: 'In-app notifications' },
]

export const REQUIREMENTS_GROUPS = [
  {
    title: 'Academic credentials',
    items: [
      'SSC / recognised equivalent with Mathematics & English proficiency.',
      'Certified transcripts and national examination statements (PDF).',
    ],
  },
  {
    title: 'Identity & references',
    items: [
      'Government-issued ID or biometric passport scan.',
      'Two academic or professional referees (recommendation letters welcomed).',
    ],
  },
  {
    title: 'Language readiness',
    items: ['English-medium instruction — bridge programmes available where needed.'],
  },
]

export const TUITION_ITEMS = [
  {
    title: 'Acceptance registration',
    amount: '150,000 SSP',
    description: 'Reference fee for provisional cohort placement (council updates may apply).',
  },
  {
    title: 'Payment rails',
    amount: 'Multi-channel',
    description: 'Simulated cashier, Stripe, Flutterwave, MTN MoMo, and Airtel Money stubs in applicant portal.',
  },
  {
    title: 'Verification',
    amount: 'Finance desk',
    description: 'Funds must show verified before the registrar issues your learner login number.',
  },
]

export const SCHOLARSHIP_BANDS = [
  {
    title: 'Future Innovators (merit)',
    description: 'Targets STEM excellence, portfolio strength, and national exam performance.',
  },
  {
    title: 'Women in ICT',
    description: 'Strategic widening participation aligned with Jonglei innovation goals.',
  },
  {
    title: 'Community access',
    description: 'Pastoral and geographic equity considerations after dossier completeness.',
  },
]

export const ADMISSIONS_FAQS = [
  {
    q: 'How quickly are decisions communicated?',
    a: 'Officers aim for a two-week SLA after your dossier is complete. Timelines extend if document uplift is requested.',
  },
  {
    q: 'Do you accept transferees mid-intake?',
    a: 'Select programmes allow limited lateral entry. The desk reviews academic parity before a provisional letter is issued.',
  },
  {
    q: 'Which payment methods are supported?',
    a: 'Applicants can initiate payments via configured rails in the portal. Finance verifies ledger rows before enrollment.',
  },
  {
    q: 'Where do I track my application?',
    a: 'Sign in to the applicant portal for timelines, officer notes, and document callbacks — not over email threads.',
  },
]
