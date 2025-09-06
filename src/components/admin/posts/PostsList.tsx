'use client'

import { useState, useEffect } from 'react'
import PostCard from './PostCard'
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
        {/* <Link href='/admin/new'>
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
            <Plus className='w-4 h-4 mr-2' />
            Write your first story
          </Button>
        </Link> */}
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
