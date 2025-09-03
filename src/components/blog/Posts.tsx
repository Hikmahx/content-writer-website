'use client'
import type { PostMeta } from '@/models/blogs/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Pagination, { PaginationState } from '../global/Pagination'
import CardPost from './CardPost'
import Search from './Search'
import SortSelect from './SortSelect'


type Props = Readonly<{
  posts: PostMeta[]
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
  limit
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
  }, [pageIndex, pageSize])

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex,
      setPageIndex,
      pageSize,
      setPageSize,
      pageCount,
      loading: false
    }),
    [pageIndex, pageCount, pageSize]
  )

  return (
    <main className='flex min-h-screen flex-col px-4 xl:px-0 py-8 container mx-auto lg:max-w-7xl'>
      <Search searchTerm={searchTerm} />
      <div className='w-full flex justify-between mb-4 mt-8'>
        <h1 className='text-2xl font-bold tracking-tight prose-h1'>Articles</h1>
        <SortSelect />
      </div>
      <div className='flex flex-col mx-auto gap-x-6 gap-y-4 lg:gap-y-2 w-full'>
        {posts.length < 1 && (
          <div className='flex justify-center'>No Post Yet.</div>
        )}
        {posts.length < 1 && searchTerm !== '' && (
          <h2 className='text-xl tracking-tight prose-h2 text-center mt-4'>
            No title found matching {`'${searchTerm}'`}. Please update your
            search term
          </h2>
        )}
        {posts.map(post => (
          <CardPost key={post.id} post={post} />
        ))}
      </div>
      <div className='py-9 flex items-center justify-center'>
        <Pagination pagination={pagination} />
      </div>
    </main>
  )
}
