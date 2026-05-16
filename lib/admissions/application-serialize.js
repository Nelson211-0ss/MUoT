/** @typedef {import('@prisma/client').AdmissionApplication & { admissionFaculty?: object; admissionProgram?: object; admissionIntake?: object; documents?: object[]; timeline?: object[]; comments?: object[]; payments?: object[] }} AppWithRelations */

/** @returns {unknown} */
export function safeJson(s) {
  try {
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}

/** @param {AppWithRelations | null | undefined} app */
export function serializeApplication(app) {
  if (!app) return null
  return {
    id: app.id,
    status: app.status,
    fullName: app.fullName,
    gender: app.gender,
    dateOfBirth: app.dateOfBirth?.toISOString() ?? null,
    nationality: app.nationality,
    address: app.address,
    phone: app.phone,
    passportPhotoPath: app.passportPhotoPath,
    previousSchool: app.previousSchool,
    academicQualifications: app.academicQualifications,
    nationalExamResults: app.nationalExamResults,
    graduationYear: app.graduationYear,
    admissionFacultyId: app.admissionFacultyId,
    programId: app.programId,
    intakeId: app.intakeId,
    studyMode: app.studyMode,
    submittedAt: app.submittedAt?.toISOString() ?? null,
    decisionAt: app.decisionAt?.toISOString() ?? null,
    registrarFinalizedAt: app.registrarFinalizedAt?.toISOString() ?? null,
    studentNumber: app.studentNumber,
    onboardingSeenAt: app.onboardingSeenAt?.toISOString() ?? null,
    faculty: app.admissionFaculty,
    program: app.admissionProgram,
    intake: app.admissionIntake,
    documents: app.documents,
    timeline: app.timeline?.map((t) => ({
      ...t,
      payload: safeJson(t.payload),
      createdAt: t.createdAt.toISOString(),
    })),
    comments: app.comments,
    payments: app.payments,
  }
}

/** @param {AppWithRelations | null | undefined} app */
export function recommendMissingDocs(app) {
  const types = new Set((app?.documents ?? []).map((d) => d.docType))
  const miss = []
  if (!types.has('TRANSCRIPT')) miss.push('Academic transcripts')
  if (!types.has('IDENTITY')) miss.push('National ID or passport scan')
  if (!types.has('PASSPORT_PHOTO')) miss.push('Passport photograph')
  return miss
}
