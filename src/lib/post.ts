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
  published?: boolean,
  itemsPerPage?: number
): Promise<{ posts: Post[]; totalCount: number; totalPages: number }> {
  try {
    const queryParams = new URLSearchParams()
    if (sortBy) queryParams.append('sortBy', sortBy)
    if (page) queryParams.append('page', page)
    if (search) queryParams.append('search', search)
    if (published !== undefined)
      queryParams.append('published', published.toString())
    if (itemsPerPage)
      queryParams.append('itemsPerPage', itemsPerPage.toString())

    const queryString = queryParams.toString()
    const url = queryString
      ? `${getApiBaseUrl()}/posts?${queryString}`
      : `${getApiBaseUrl()}/posts`

    const response = await fetch(url, { cache: 'no-store' })

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

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/posts/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch post: ${response.status}`)
    }
    
    const post = await response.json()
    return post
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/posts/${postId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete post')
    }
  } catch (error) {
    console.error('Failed to delete post:', error)
    throw error
  }
}

export async function savePost(
  postData: Partial<Post>,
  postSlug?: string
): Promise<Post> {
  const method = postSlug ? 'PUT' : 'POST'
  const url = postSlug
    ? `${getApiBaseUrl()}/posts/${postSlug}`
    : `${getApiBaseUrl()}/posts`

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to save post')
  }

  return data
}

export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/upload?publicId=${publicId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete image')
    }
    
    return true
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    return false
  }
}

export async function uploadImageToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${getApiBaseUrl()}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id
  }
}
