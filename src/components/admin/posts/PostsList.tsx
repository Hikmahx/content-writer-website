'use client'

import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import type { Post } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { fetchPosts } from '@/lib/post'

interface PostsListProps {
  published: boolean
}

export default function PostsList({ published }: PostsListProps) {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [published])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const { posts: fetchedPosts, totalCount: count } = await fetchPosts(
        'date',
        '1',
        '',
        published
      )
      setPosts(fetchedPosts)
      setTotalCount(count)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      console.error('Failed to fetch posts:', err)
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

  if (posts.length === 0) {
    return (
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
    )
  }

  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
