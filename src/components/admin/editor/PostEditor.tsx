'use client'

import { useState, useEffect } from 'react'
import RichPostEditor from './RichPostEditor'
import EditorHeader from './EditorHeader'
import type { Post } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { getPost, savePost } from '@/lib/post'
import {
  extractTextFromHTML,
  extractImageUrlsFromHTML,
  cleanupUnusedImages,
} from '@/lib/utils/post'

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
  const [allUploadedImages, setAllUploadedImages] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (!postSlug) return
      setLoading(true)
      try {
        const data = await getPost(postSlug)
        if (data) {
          setPost(data)
          // Initialize with images from existing post content
          if (data.content) {
            const initialImages = extractImageUrlsFromHTML(data.content)
            setAllUploadedImages(initialImages)
          }
        }
      } catch (error) {
        console.error('Failed to fetch post:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [postSlug])

  const handleSave = async (published: boolean) => {
    setSaving(true)
    try {
      // Clean up unused images before saving
      if (post.content) {
        await cleanupUnusedImages(post.content, allUploadedImages)
      }

      const postData = {
        ...post,
        published,
        description: extractTextFromHTML(post.content || ''),
        slug:
          post.title
            ?.toLowerCase()
            ?.trim()
            ?.replace(/\s+/g, '-')
            ?.replace(/[^\w-]+/g, '')
            ?.replace(/-+/g, '-')
            ?.replace(/^-+|-+$/g, '') ?? '',
      }

      if (!postData.img) {
        console.log('Warning: Post will be published without an image')
      }

      const savedPost = await savePost(postData, postSlug)
      setPost(savedPost)

      // Reset uploaded images after successful save
      if (savedPost.content) {
        const currentImages = extractImageUrlsFromHTML(savedPost.content)
        setAllUploadedImages(currentImages)
      }

      router.push('/admin')
    } catch (error: any) {
      console.error('Failed to save post:', error.message)
    } finally {
      setSaving(false)
    }
  }

  // Handle image tracking from the RichPostEditor
  const handleImageUpload = (imageUrl: string) => {
    setAllUploadedImages((prev) => [...prev, imageUrl])
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
          onImageUpload={handleImageUpload}
        />
      </div>
    </div>
  )
}
