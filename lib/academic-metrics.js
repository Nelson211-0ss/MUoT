import { percentToGradePoint, roundGpa } from '@/lib/gpa'

/**
 * @param {Array<{ academicYear: number, semesterNumber: number, scorePercent: number, programCourseUnit?: { creditHours?: number }}}>} rows
 * @returns {{ semesters: Array<{ academicYear: number, semesterNumber: number, semesterGpa: number, cumulativeGpa: number, lines: unknown[] }> }}
 */
export function buildTranscriptSnapshots(rows) {
  const keyed = [...rows].sort((a, b) => {
    if (a.academicYear !== b.academicYear) return a.academicYear - b.academicYear
    return a.semesterNumber - b.semesterNumber
  })

  /** @type {Map<string, typeof rows>} */
  const bySemester = new Map()
  for (const r of keyed) {
    const k = `${r.academicYear}-${r.semesterNumber}`
    if (!bySemester.has(k)) bySemester.set(k, [])
    bySemester.get(k).push(r)
  }

  let cumCredits = 0
  let cumPoints = 0

  /** @type {Array<{ academicYear: number, semesterNumber: number, semesterGpa: number, cumulativeGpa: number, lines: typeof rows}>} */
  const semesters = []

  for (const [, group] of bySemester.entries()) {
    let semCredits = 0
    let semPoints = 0

    /** @type {typeof rows} */
    const lines = []
    for (const r of group) {
      const credits = Number(r.programCourseUnit?.creditHours ?? 3) || 0
      const { letter, gp } = percentToGradePoint(r.scorePercent)
      semCredits += credits
      semPoints += gp * credits
      lines.push({
        ...r,
        letter,
        gp,
      })
      cumCredits += credits
      cumPoints += gp * credits
    }

    const semesterGpa = semCredits ? roundGpa(semPoints / semCredits) : 0
    const cumulativeGpa = cumCredits ? roundGpa(cumPoints / cumCredits) : 0

    semesters.push({
      academicYear: group[0].academicYear,
      semesterNumber: group[0].semesterNumber,
      semesterGpa,
      cumulativeGpa,
      lines,
    })
  }

  return { semesters }
}
