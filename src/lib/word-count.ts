export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function countWordsFromHtml(html: string): number {
  const plain = html.replace(/<[^>]*>/g, ' ').trim()
  return countWords(plain)
}

export function wordCountInRange(
  text: string,
  min: number,
  max: number,
): boolean {
  const count = countWords(text)
  return count >= min && count <= max
}
