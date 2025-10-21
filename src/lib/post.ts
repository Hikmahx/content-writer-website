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
  category?: string,
  published?: boolean,
  itemsPerPage?: number
): Promise<{
  posts: Post[]
  totalCount: number
  totalPages: number
  categories: string[]
}> {
  try {
    const queryParams = new URLSearchParams()
    if (sortBy) queryParams.append('sortBy', sortBy)
    if (page) queryParams.append('page', page)
    if (search) queryParams.append('search', search)
    if (category) queryParams.append('category', category)
    if (published !== undefined)
      queryParams.append('published', published.toString())
    if (itemsPerPage)
      queryParams.append('itemsPerPage', itemsPerPage.toString())

    const url = `${getApiBaseUrl()}/posts${
      queryParams.toString() ? `?${queryParams}` : ''
    }`
    const response = await fetch(url, { cache: 'no-store' })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch posts: ${response.status} ${response.statusText}`
      )
    }

    return await response.json()
  } catch (err) {
    console.error('Failed to fetch posts:', err)
    throw err
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/posts/${slug}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(
        `Failed to fetch post: ${response.status} ${response.statusText}`
      )
    }

    return await response.json()
  } catch (err) {
    console.error('Failed to fetch post:', err)
    return null
  }
}

export async function savePost(
  postData: Partial<Post>,
  postSlug?: string
): Promise<Post> {
  try {
    const method = postSlug ? 'PUT' : 'POST'
    const url = `${getApiBaseUrl()}/posts${postSlug ? `/${postSlug}` : ''}`

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
      cache: 'no-store',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        error.error || `Failed to ${postSlug ? 'update' : 'create'} post`
      )
    }

    return await response.json()
  } catch (err) {
    console.error('Failed to save post:', err)
    throw err
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/posts/${postId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(
        `Failed to delete post: ${response.status} ${response.statusText}`
      )
    }
  } catch (err) {
    console.error('Failed to delete post:', err)
    throw err
  }
}

export async function uploadImageToCloudinary(
  file: File
): Promise<{ url: string; publicId: string }> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${getApiBaseUrl()}/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(
        `Failed to upload image: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return { url: data.secure_url, publicId: data.public_id }
  } catch (err) {
    console.error('Failed to upload image:', err)
    throw err
  }
}

export async function deleteImageFromCloudinary(
  publicId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/upload?publicId=${publicId}`,
      { method: 'DELETE' }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to delete image: ${response.status} ${response.statusText}`
      )
    }
  } catch (err) {
    console.error('Failed to delete image from Cloudinary:', err)
    throw err
  }
}
