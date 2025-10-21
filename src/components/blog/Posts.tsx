'use client'

import type { Post } from '@/lib/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Pagination, { PaginationState } from '../global/Pagination'
import CardPost from './CardPost'
import Search from './Search'
import SelectDropdown from './SelectDropdown'

type Props = Readonly<{
  posts: Post[]
  currentPage: number
  pageCount: number
  searchTerm: string
  limit: number
  categories: any[]
}>

export default function Posts({
  posts,
  currentPage,
  pageCount,
  searchTerm,
  limit,
  categories,
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
      <div className='w-full flex flex-col lg:flex-row gap-4 justify-between mb-4 lg:mb-12 mt-8 lg:justify-center'>
        <div className='flex flex-col justify-center text-center gap-8 mb-8'>
          <h1 className='text-5xl font-bold font-serif'>
            My Articles
          </h1>
          <h2 className='text-sm lg:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Insights and lessons from my writing journey as I explore
            creativity, productivity, and the craft of great content. I share
            tips on SEO, creative writing and storytelling to help words connect
            and engage online.
          </h2>
        </div>
        <div className='flex flex-col sm:flex-row gap-6 w-full justify-between lg:hidden'>
          <Search searchTerm={searchTerm} />
          <div className='flex gap-4'>
            <SelectDropdown
              label='Sort By'
              paramKey='sortBy'
              defaultValue='date'
              options={[
                { label: 'Created At', value: 'date' },
                { label: 'Title', value: 'title' },
              ]}
              className='w-full sm:max-w-[200px] truncate'
            />
            <SelectDropdown
              label='Category'
              paramKey='category'
              defaultValue='all'
              options={[
                { label: 'All', value: 'all' },
                ...categories.map((cat) => ({
                  label: cat.title,
                  value: cat.title,
                })),
              ]}
              className='w-full sm:max-w-[200px] truncate'
            />
          </div>
        </div>
      </div>
      <div className='flex gap-12'>
        <div className='flex flex-col flex-1 mx-auto gap-x-6 gap-y-4 md:gap-y-0 w-full max-w-5xl'>
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

        <div className='hidden w-1/5 h-fit sticky top-10 lg:flex flex-col gap-8'>
          <Search searchTerm={searchTerm} />

          <div className='mt-8'>
            <h3 className='font-semibold mb-2 font-serif'>Sort By</h3>
            <SelectDropdown
              label='Sort By'
              paramKey='sortBy'
              defaultValue='date'
              options={[
                { label: 'Created At', value: 'date' },
                { label: 'Title', value: 'title' },
              ]}
              className='w-full truncate'
            />
          </div>
          <div className=''>
            {categories.length > 0 && (
              <>
                <h3 className='font-semibold mb-4 font-serif'>Categories</h3>
                <ul className='space-y-2 rounded-md py-4 bg-slate-100/50 w-full'>
                  <li>
                    <a
                      href='/blog'
                      className='capitalize text-gray-700 hover:text-gray-900 block hover:bg-beige/30 w-full px-6 py-1'
                    >
                      All
                    </a>
                  </li>
                  {categories.map((cat) => {
                    const name = cat.title
                    return (
                      <li key={name}>
                        <a
                          href={`/blog?category=${encodeURIComponent(name)}`}
                          className='text-gray-700 hover:text-gray-900 block hover:bg-beige/30 w-full px-6 py-1'
                        >
                          {name}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      <div className='py-9 flex items-center justify-center'>
        <Pagination pagination={pagination} />
      </div>
    </main>
  )
}
