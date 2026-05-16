/** @typedef {{ key: string, label: string, order: number }} AdmissionStatusMeta */

export const ADMISSION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  AWAITING_DOCUMENTS: 'AWAITING_DOCUMENTS',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  ENROLLED: 'ENROLLED',
}

export const STATUS_FLOW = [
  ADMISSION_STATUS.DRAFT,
  ADMISSION_STATUS.SUBMITTED,
  ADMISSION_STATUS.UNDER_REVIEW,
  ADMISSION_STATUS.APPROVED,
  ADMISSION_STATUS.AWAITING_PAYMENT,
  ADMISSION_STATUS.ENROLLED,
]

export const DOC_TYPES = {
  TRANSCRIPT: 'TRANSCRIPT',
  ID: 'IDENTITY',
  RECOMMENDATION: 'RECOMMENDATION',
  CERTIFICATE: 'CERTIFICATE',
  PASSPORT_PHOTO: 'PASSPORT_PHOTO',
  OTHER: 'OTHER',
}

export const STUDY_MODES = [
  { value: 'FULL_TIME', label: 'Full-time (on-campus)' },
  { value: 'PART_TIME', label: 'Part-time (evening/weekend)' },
  { value: 'ONLINE', label: 'Online / blended' },
]

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
export const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
])

export const OTP_PURPOSES = {
  EMAIL_VERIFY: 'EMAIL_VERIFY',
  LOGIN_OTP: 'LOGIN_OTP',
  RESET_PASSWORD: 'RESET_PASSWORD',
}
