'use client'
import type { Post } from '@/lib/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Pagination, { PaginationState } from '../global/Pagination'
import CardPost from './CardPost'
import Search from './Search'
import SortSelect from './SortSelect'

type Props = Readonly<{
  posts: Post[]
  currentPage: number
  pageCount: number
  searchTerm: string
  limit: number
}>

export default function Posts({
  posts,
  currentPage,
  pageCount,
  searchTerm,
  limit,
}: Props) {
  const [pageIndex, setPageIndex] = useState(currentPage - 1)
  const [pageSize, setPageSize] = useState(limit)
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (pageIndex + 1 !== 1) {
      params.set('page', `${pageIndex + 1}`)
    } else {
      params.delete('page')
    }

    if (pageSize > 10 && pageSize) {
      params.set('limit', `${pageSize}`)
    } else {
      params.delete('limit')
    }

    replace(params.size ? `/${basePath}?${params.toString()}` : basePath)
    // eslint-disable-next-line
  }, [
    pageIndex,
    pageSize,
    // , basePath, searchParams, replace
  ])

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex,
      setPageIndex,
      pageSize,
      setPageSize,
      pageCount,
      loading: false,
    }),
    [pageIndex, pageCount, pageSize]
  )

  return (
    <main className='flex min-h-screen flex-col px-4 xl:px-0 py-8 container mx-auto lg:max-w-7xl'>
      <Search searchTerm={searchTerm} />
      <div className='w-full flex justify-between mb-4 mt-8'>
        <h1 className='text-2xl font-bold tracking-tight'>Articles</h1>
        <SortSelect />
      </div>
      <div className='flex flex-col mx-auto gap-x-6 gap-y-4 md:gap-y-0 w-full'>
        {posts.length < 1 && (
          <div className='flex justify-center'>No Post Yet.</div>
        )}
        {posts.length < 1 && searchTerm !== '' && (
          <div className='text-center py-12'>
            <h2 className='text-xl font-semibold mb-2'>
              No posts found matching &ldquo;{searchTerm}&rdquo;
            </h2>
            <p className='text-muted-foreground'>
              Try adjusting your search terms or browse all posts.
            </p>
          </div>
        )}
        {posts.map((post) => (
          <CardPost key={post.id} post={post} />
        ))}
      </div>
      {/* {pageCount > 1 && ( */}
      <div className='py-9 flex items-center justify-center'>
        <Pagination pagination={pagination} />
      </div>
      {/* )} */}
    </main>
  )
}
