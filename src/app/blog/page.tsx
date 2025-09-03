import Posts from '@/components/blog/Posts'
import { getPosts } from '@/models/blogs/data'
import { z } from 'zod'
import { metadata, jsonLd } from './seo'

export const revalidate = 12 * 3600
export { metadata }

const SearchParamData = z.object({
  sortBy: z.union([z.literal('date'), z.literal('title')]).optional(),
  page: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str) : undefined)),
  search: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str) : undefined)),
})

type SearchParamData = z.infer<typeof SearchParamData>

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    sortBy?: string
    page?: string
    search?: string
    limit?: number
  }
}) {
  const params = await searchParams
  const parseRes = SearchParamData.safeParse(params)
  const {
    sortBy,
    page = 1,
    search = '',
    limit = 10,
  } = parseRes.success ? parseRes.data : ({} as Partial<SearchParamData>)
  // Sanitize
  const _page = page < 1 || !isFinite(page) ? 1 : page
  const _limit = limit < 1 || !isFinite(limit) ? 1 : limit
  const keyword = search.substring(0, 100)
  const { posts, currentPage, pageCount } = getPosts(
    sortBy,
    _page,
    keyword,
    _limit
  )

  return (
    <>
      {/* JSON-LD */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Posts
        posts={posts}
        currentPage={currentPage}
        pageCount={pageCount}
        searchTerm={search}
        limit={limit}
      />
    </>
  )
}
