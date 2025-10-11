export function formatDateForInput(dateString: string | Date): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export function formatDateForDB(dateString: string): Date {
  return new Date(dateString)
}