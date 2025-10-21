import { Metadata } from 'next'
import Posts from '@/components/blog/Posts'
import { fetchPosts } from '@/lib/post'
import { metadata, jsonLd } from './seo'
import { connection } from 'next/server'

export { metadata }
export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    sortBy?: string
    page?: string
    search?: string
    category?: string
    // limit?: number
  }>
}) {
  await connection()

  const params = await searchParams
  const sortBy = params?.sortBy || 'date'
  const currentPage = Math.max(1, parseInt(params?.page || '1') || 1)
  const searchTerm = params?.search || ''
  const category = params?.category || 'all'

  const data = await fetchPosts(
    sortBy,
    currentPage.toString(),
    searchTerm,
    category,
    // true,
    // 10
  )

  return (
    <>
      {/* JSON-LD */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Posts
        posts={data.posts}
        currentPage={currentPage}
        pageCount={data.totalPages}
        searchTerm={searchTerm}
        limit={10}
        categories={data.categories}
      />
    </>
  )
}
