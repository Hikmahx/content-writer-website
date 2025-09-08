'use client'

import { useState, useEffect } from 'react'
import RichPostEditor from './RichPostEditor'
import EditorHeader from './EditorHeader'
import type { Post, PostStatus } from '@/lib/types'

interface PostEditorProps {
  postId?: string
}

export default function PostEditor({ postId }: PostEditorProps) {
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    description: '',
    content: '',
    hashtags: [],
    status: 'DRAFT' as PostStatus,
    img: '',
  })
  const [loading, setLoading] = useState(!!postId)
  const [saving, setSaving] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)

  useEffect(() => {
    if (postId) {
      setLoading(true)
      fetch(`/api/posts/${postId}`)
        .then((response) => response.ok ? response.json() : null)
        .then((data) => {
          if (data) setPost(data)
        })
        .catch((error) => {
          console.error('Failed to fetch post:', error)
        })
        .finally(() => setLoading(false))
    }
  }, [postId])

  const handleSave = async (status: PostStatus = post.status || 'DRAFT') => {
    setSaving(true)
    try {
      // Prepare the post data for saving
      const postData = {
        ...post,
        status,
        published: status === 'PUBLISHED',
      }

      // Log the post data in JSON format to console
      console.log('Saving post:', JSON.stringify(postData, null, 2))

      const method = postId ? 'PUT' : 'POST'
      const url = postId ? `/api/posts/${postId}` : '/api/posts'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })
      if (response.ok) {
        const savedPost = await response.json()
        setPost(savedPost)
        console.log('Post saved successfully:', savedPost)
        // Show success message
      } else {
        console.error('Failed to save post:', response.statusText)
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleImageInsert = (imageUrl: string) => {
    setPost((prev) => ({
      ...prev,
      // TipTap handles image insertion, so no need to update content here
      // img: imageUrl,
    }))
    setShowImageUpload(false)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <EditorHeader post={post} saving={saving} onSave={handleSave} />
      <div className='px-4 pb-8'>
        <RichPostEditor
          post={post}
          onChange={setPost}
          showImageUpload={showImageUpload}
          setShowImageUpload={setShowImageUpload}
          onImageInsert={handleImageInsert}
        />
      </div>
    </div>
  )
}
