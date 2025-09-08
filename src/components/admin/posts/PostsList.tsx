'use client'

import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import type { Post, PostStatus } from '@/lib/types'
import { useSession } from 'next-auth/react'
import CardPost from '@/components/blog/CardPost'

interface PostsListProps {
  status: PostStatus
}

export default function PostsList({ status }: PostsListProps) {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        cache: 'no-store'
      })
      const data = await response.json()
      const posts = await data.posts
      // console.log(posts)
      setPosts(posts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
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

  const isPublished = status === 'PUBLISHED'

  if (posts.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-semibold text-foreground mb-2'>
          {isPublished ? 'No published stories yet' : 'No drafts yet'}
        </h3>
        <p className='text-muted-foreground mb-6 max-w-sm mx-auto'>
          {isPublished
            ? 'Start writing and publish your first story to share with the world.'
            : 'Create a draft to start working on your next story.'}
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {posts.length > 0 && posts.map((post) => (
        <PostCard key={post.id} post={post} />
        // <CardPost key={post.id} post={post} />
      ))}
    </div>
  )
}
