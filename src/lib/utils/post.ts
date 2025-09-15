import { prisma } from "../prisma"

/**
 * Validates that a slug is unique across all posts
 * @param slug - The slug to validate
 * @param excludePostId - Optional post ID to exclude from check (useful for updates)
 * @throws {Error} If slug already exists or user is not authenticated
 */
export async function validateSlugUniqueness(
  slug: string,
  excludePostId?: string
): Promise<void> {
  const existingPost = await prisma.post.findFirst({
    // For updates: exclude current post to allow updating its own slug
    // For creates: no exclusion needed (check if any post has this slug)
    where: excludePostId ? { slug, id: { not: excludePostId } } : { slug },
  })

  if (existingPost) {
    throw new Error('Title should be unique always')
  }
}

/**
 * Extracts plain text from an HTML string and returns a trimmed snippet.
 * - Removes all HTML tags (e.g. <p>, <b>, <img>)
 * - Returns only text content
 * - Slices to the given limit (default 200 chars)
 *
 * @param html - The HTML string
 * @param limit - The max number of characters (default 200)
 * @returns A plain text snippet
 */
export function extractTextFromHTML(html: string, limit = 300): string {
  if (!html) return ''

  // If running in the browser, use DOMParser
  if (typeof window !== 'undefined') {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const text = doc.body.textContent || ''
    return text.slice(0, limit).trim()
  }

  // Server-side fallback (regex strips tags)
  const text = html.replace(/<[^>]*>/g, '')
  return text.slice(0, limit).trim()
}

export function extractFirstImageFromHTML(html: string): string | null {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  const firstImg = tempDiv.querySelector('img')
  return firstImg ? firstImg.src : null
}