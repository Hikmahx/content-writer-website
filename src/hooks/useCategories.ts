import useSWR from 'swr'
import { fetcher, getApiUrl } from '@/lib/swr-config'

interface Category {
  id: string
  title: string
}

interface PostsResponse {
  posts: unknown[]
  totalCount: number
  totalPages: number
  categories: Category[]
}

export function useCategories() {
  const key = getApiUrl('/posts', { itemsPerPage: '1' })

  const { data, error, isLoading } = useSWR<PostsResponse>(key, fetcher, {
    dedupingInterval: 60000,
  })

  const categories = data?.categories || []
  const categoriesWithAll = [{ id: 'all', title: 'All' }, ...categories]

  return {
    categories: categoriesWithAll,
    isLoading,
    isError: !!error,
    error,
  }
}
