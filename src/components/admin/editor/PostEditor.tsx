'use client'

import { useState, useEffect } from 'react'
import RichPostEditor from './RichPostEditor'
import EditorHeader from './EditorHeader'
import type { Post } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface PostEditorProps {
  postSlug?: string
}

export default function PostEditor({ postSlug }: PostEditorProps) {
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    description: '',
    content: '',
    hashtags: [],
    published: false,
    img: '',
  })
  const [loading, setLoading] = useState(!!postSlug)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchPost = async () => {
      if (postSlug) {
        setLoading(true)
        try {
          const response = await fetch(`/api/posts/${postSlug}`)
          if (response.ok) {
            const data = await response.json()
            setPost(data)
          }
        } catch (error) {
          console.error('Failed to fetch post:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchPost()
  }, [postSlug])

  const handleSave = async (published: boolean) => {
    setSaving(true)
    try {
      const postData = {
        ...post,
        published,
        slug:
          post.title
            ?.toLowerCase()
            ?.trim()
            ?.replace(/\s+/g, '-')
            ?.replace(/[^\w-]+/g, '')
            ?.replace(/-+/g, '-')
            ?.replace(/^-+|-+$/g, '') ?? '',
      }

      const method = postSlug ? 'PUT' : 'POST'
      const url = postSlug ? `/api/posts/${postSlug}` : '/api/posts'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save post')
      }

      // Success case
      setPost(data)
      console.log('Post saved successfully:', data)
      router.push('/admin')
    } catch (error: any) {
      console.error('Failed to save post:', error.message)
    } finally {
      setSaving(false)
    }
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
        <RichPostEditor post={post} onChange={setPost} />
      </div>
    </div>
  )
}
