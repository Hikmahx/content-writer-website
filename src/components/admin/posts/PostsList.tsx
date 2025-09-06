'use client'

import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import EmptyState from './EmptyState'
import type { Post, PostStatus } from '@/lib/types'

interface PostsListProps {
  status: PostStatus
}

export default function PostsList({ status }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?status=${status}`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [status])

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

  if (posts.length === 0) {
    return <EmptyState status={status} />
  }

  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
