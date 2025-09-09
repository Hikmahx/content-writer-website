import { Post } from './types'

// Base API URL helper
function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL
    return '/api'
  }
  // Server-side: use absolute URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/api`
}

export async function fetchPosts(
  sortBy?: string,
  page?: string,
  search?: string,
  published?: boolean
): Promise<{ posts: Post[]; totalCount: number }> {
  try {
    const queryParams = new URLSearchParams()
    if (sortBy) queryParams.append('sortBy', sortBy)
    if (page) queryParams.append('page', page)
    if (search) queryParams.append('search', search)
    if (published !== undefined)
      queryParams.append('published', published.toString())

    const queryString = queryParams.toString()
    const url = queryString
      ? `${getApiBaseUrl()}/posts?${queryString}`
      : `${getApiBaseUrl()}/posts`

    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    throw error
  }
}