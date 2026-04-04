import useSWR from 'swr'
import { fetcher, getApiUrl } from '@/lib/swr-config'
import type { Post } from '@/lib/types'
import { mutate } from 'swr'

interface PostsResponse {
  posts: Post[]
  totalCount: number
  totalPages: number
  categories: string[]
}

interface UsePostsParams {
  sortBy?: string
  page?: string
  search?: string
  category?: string
  published?: boolean
  itemsPerPage?: number
  enabled?: boolean
}

export function usePosts(params: UsePostsParams = {}) {
  const {
    sortBy,
    page,
    search,
    category,
    published,
    itemsPerPage,
    enabled = true,
  } = params

  const queryParams: Record<string, string> = {}
  if (sortBy) queryParams.sortBy = sortBy
  if (page) queryParams.page = page
  if (search) queryParams.search = search
  if (category) queryParams.category = category
  if (published !== undefined) queryParams.published = published.toString()
  if (itemsPerPage) queryParams.itemsPerPage = itemsPerPage.toString()

  const key = enabled ? getApiUrl('/posts', queryParams) : null

  const {
    data,
    error,
    isLoading,
    mutate: mutatePosts,
  } = useSWR<PostsResponse>(key, fetcher)

  return {
    posts: data?.posts || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    categories: data?.categories || [],
    isLoading,
    isError: !!error,
    error,
    mutate: mutatePosts,
  }
}

export function usePost(slug: string | null | undefined) {
  const key = slug ? getApiUrl(`/posts/${slug}`) : null

  const {
    data,
    error,
    isLoading,
    mutate: mutatePost,
  } = useSWR<Post>(key, fetcher)

  return {
    post: data || null,
    isLoading,
    isError: !!error,
    error,
    mutate: mutatePost,
  }
}

export async function mutateAllPosts() {
  await mutate((key) => typeof key === 'string' && key.includes('/posts'))
}

