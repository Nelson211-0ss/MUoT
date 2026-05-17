/**
 * Capitalize the first letter of each word for section headings.
 * Preserves mixed-case brands (MUoT) and acronyms (MUT, IT).
 */
function capitalizeWord(word) {
  if (!word) return word
  if (/[A-Z]/.test(word) && /[a-z]/.test(word)) return word
  if (/^[A-Z0-9&'.!?]+$/.test(word)) return word

  return word
    .split(/(-)/)
    .map((part) => {
      if (part === '-' || !part) return part
      if (/[A-Z]/.test(part) && /[a-z]/.test(part)) return part
      if (/^[A-Z0-9&'.!?]+$/.test(part)) return part
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    })
    .join('')
}

export function toTitleCase(value) {
  if (!value || typeof value !== 'string') return value
  return value.split(/(\s+)/).map((segment) => (segment.trim() ? capitalizeWord(segment) : segment)).join('')
}
