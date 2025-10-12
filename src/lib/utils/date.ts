export function formatDateForInput(dateString: string | Date): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export function formatDateForDB(dateString: string): Date {
  return new Date(dateString)
}

export const formatDateRange = (startDate: string, endDate?: string) => {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
  const startYear = start.getFullYear()
  if (end) {
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
    const endYear = end.getFullYear()
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
  }
  return `${startMonth} ${startYear} - Present`
}
