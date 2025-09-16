'use client'

import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import type { Post } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { fetchPosts, deletePost } from '@/lib/post'
import Pagination from '@/components/global/Pagination'

import { toast } from 'sonner'

interface PostsListProps {
  published: boolean
}

export default function PostsList({ published }: PostsListProps) {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [pageCount, setPageCount] = useState(1)

  const handleDeletePost = async (postSlug: string) => {
    try {
      await deletePost(postSlug)
      setPosts(posts.filter((post) => post.slug !== postSlug))
      setTotalCount(totalCount - 1)
      toast('Post deleted.')
    } catch (err) {
      toast.message('Failed to delete post.', {
        description: typeof err === 'object' && err && 'message' in err ? (err as { message: string }).message : 'An error occurred',
      })
      throw err
    }
  }

  useEffect(() => {
    loadPosts()
  }, [published, pageIndex, pageSize])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const {
        posts: fetchedPosts,
        totalCount,
        totalPages,
      } = await fetchPosts(
        'date',
        (pageIndex + 1).toString(),
        '',
        published,
        pageSize
      )
      setPosts(fetchedPosts)
      setTotalCount(totalCount)
      setPageCount(Math.ceil(totalCount / pageSize))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      toast.message('Failed to fetch posts.', {
        description: typeof err === 'object' && err && 'message' in err ? (err as { message: string }).message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = session?.user?.role === 'ADMIN'

  if (!isAdmin && !loading) {
    return (
      <div className='flex h-[50vh] items-center'>
        <p className=''>Unauthorized Access</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='animate-pulse'>
            <div className='bg-card rounded-lg p-6 border'>
              <div className='h-4 bg-muted rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-muted rounded w-1/2 mb-4'></div>
              <div className='h-3 bg-muted rounded w-1/4'></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-10'>
        <p className='text-lg'>
          <span className='font-semibold'>Error: </span>
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {posts.length === 0 ? (
          <div className='text-center py-12'>
            <h3 className='text-lg font-semibold text-foreground mb-2'>
              {published ? 'No published stories yet' : 'No drafts yet'}
            </h3>
            <p className='text-muted-foreground mb-6 max-w-sm mx-auto'>
              {published
                ? 'Start writing and publish your first story to share with the world.'
                : 'Create a draft to start working on your next story.'}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
          ))
        )}
      </div>
      {/* {pageCount > 1 && ( */}
      <div className='flex justify-center pt-4 border-t'>
        <Pagination
          pagination={{
            pageIndex,
            setPageIndex,
            pageSize,
            setPageSize,
            pageCount,
            loading,
          }}
          scrollTo={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>
      {/* )} */}
    </div>
  )
}
