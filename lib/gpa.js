/**
 * Magwi attainment ladder (percentage → letter → grade-point on a 4.0 scale).
 * @returns {{ letter: string, gp: number }}
 */
export function percentToGradePoint(scorePercent) {
  const s = Number(scorePercent)
  if (Number.isNaN(s)) {
    throw new Error('Invalid score.')
  }

  let letter = 'F'
  if (s >= 80) letter = 'A'
  else if (s >= 70) letter = 'B'
  else if (s >= 60) letter = 'C'
  else if (s >= 50) letter = 'D'

  /** @type {Record<string, number>} */
  const map = {
    A: 4,
    B: 3,
    C: 2,
    D: 1,
    F: 0,
  }

  return { letter, gp: map[letter] ?? 0 }
}

export function roundGpa(value) {
  return Math.round(value * 100) / 100
}
