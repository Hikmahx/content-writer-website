import type { Education, Experience } from './types'

const norm = (s?: string | null) => (s || '').trim().toLowerCase()

// Month-level key (YYYY-MM) so "Jan 2022" and "2022-01-15" count as the same
function monthKey(date?: string | Date | null): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 7)
}

function removeDuplicatesBy<T>(items: T[], keyOf: (item: T) => string, score: (item: T) => number): T[] {
  const seen = new Map<string, T>()
  for (const item of items) {
    const key = keyOf(item)
    const existing = seen.get(key)
    // Keep whichever duplicate has more detail
    if (!existing || score(item) > score(existing)) seen.set(key, item)
  }
  return Array.from(seen.values())
}

export function removeDuplicateExperiences<T extends Pick<Experience, 'organization' | 'startDate' | 'responsibilities'>>(
  items: T[]
): T[] {
  return removeDuplicatesBy(
    items,
    (e) => `${norm(e.organization)}|${monthKey(e.startDate)}`,
    (e) => e.responsibilities?.length || 0
  )
}

export function removeDuplicateEducation<T extends Pick<Education, 'institution' | 'graduationDate' | 'major'>>(
  items: T[]
): T[] {
  return removeDuplicatesBy(
    items,
    (e) => `${norm(e.institution)}|${monthKey(e.graduationDate)}`,
    (e) => (e.major ? 1 : 0)
  )
}
