'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import RichPostEditor from './RichPostEditor'
import EditorHeader from './EditorHeader'
import type { Post } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { getPost, savePost } from '@/lib/post'
import {
  extractTextFromHTML,
  extractImageUrlsFromHTML,
  cleanupAllImages,
  isEmptyContent,
} from '@/lib/utils/post'
import { toast } from 'sonner'

interface PostEditorProps {
  postSlug?: string
}

const getStorageKey = (postSlug?: string) =>
  postSlug ? `post-draft-${postSlug}` : 'new-post-draft'

export default function PostEditor({ postSlug }: PostEditorProps) {
  const [loading, setLoading] = useState(!!postSlug)
  const [saving, setSaving] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [allUploadedImages, setAllUploadedImages] = useState<string[]>([])
  const router = useRouter()
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const initialLoadRef = useRef(true)

  // Use localStorage for draft backup ONLY for new posts
  const [draftPost, setDraftPost, removeDraft] = useLocalStorage<Partial<Post>>(
    getStorageKey(postSlug),
    {
      title: '',
      description: '',
      content: '',
      hashtags: [],
      published: false,
      img: '',
    }
  )

  const [post, setPost] = useState<Partial<Post>>(
    postSlug
      ? {
          title: '',
          description: '',
          content: '',
          hashtags: [],
          published: false,
          img: '',
        }
      : draftPost
  )

  // Check if content has real value (not just empty HTML)
  const hasRealContent = useCallback((postData: Partial<Post>) => {
    const hasTitle = !!postData.title?.trim()
    const hasContent = !isEmptyContent(postData.content || '')
    const hasImages = postData.content?.includes('res.cloudinary.com') || false

    return hasTitle || hasContent || hasImages
  }, [])

  // Auto-save to localStorage for new posts
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (!postSlug) {
      if (hasRealContent(post)) {
        saveTimeoutRef.current = setTimeout(() => {
          setDraftPost(post)
        }, 1000)
      } else {
        removeDraft()
      }
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [post, postSlug, setDraftPost, removeDraft, hasRealContent])

  // Load existing post data
  useEffect(() => {
    const fetchData = async () => {
      if (!postSlug) {
        setLoading(false)

        // Clean up empty drafts on initial load only
        if (initialLoadRef.current && !hasRealContent(draftPost)) {
          removeDraft()
        }
        initialLoadRef.current = false
        return
      }

      setLoading(true)
      try {
        const data = await getPost(postSlug)
        if (data) {
          setPost(data)
          if (data.content) {
            setAllUploadedImages(extractImageUrlsFromHTML(data.content))
          }
          removeDraft()
        }
      } catch (error) {
        toast.error('Failed to load post')
      } finally {
        setLoading(false)
        initialLoadRef.current = false
      }
    }
    fetchData()
  }, [postSlug, removeDraft])

  const handleSave = async (published: boolean) => {
    if (!post.title?.trim() || !post.content?.trim()) {
      toast.error('Title and content are required')
      return
    }

    setSaving(true)
    try {
      if (post.content) {
        const usedImages = extractImageUrlsFromHTML(post.content)
        const imagesToCleanup = allUploadedImages.filter(
          (url) => !usedImages.includes(url)
        )
        await cleanupAllImages(imagesToCleanup)
      }

      const postData = {
        ...post,
        published,
        description: extractTextFromHTML(post.content || ''),
        slug: post.title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, ''),
      }

      const savedPost = await savePost(postData, postSlug)
      setPost(savedPost)

      if (savedPost.content) {
        setAllUploadedImages(extractImageUrlsFromHTML(savedPost.content))
      }

      removeDraft()
      router.push('/admin')

      toast.success(published ? 'Post published!' : 'Draft saved!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    setAllUploadedImages((prev) => [...prev, imageUrl])
  }

  const handleClearDraft = async () => {
    setClearing(true)
    try {
      if (post.content && !isEmptyContent(post.content)) {
        await cleanupAllImages(extractImageUrlsFromHTML(post.content))
      }

      removeDraft()
      setPost({
        title: '',
        description: '',
        content: '',
        hashtags: [],
        published: false,
        img: '',
      })
      setAllUploadedImages([])

      toast.info('Draft cleared')
    } catch (error) {
      toast.error('Failed to clear draft')
    } finally {
      setClearing(false)
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
      <EditorHeader
        post={post}
        saving={saving}
        clearing={clearing}
        onSave={handleSave}
        onClearDraft={!postSlug ? handleClearDraft : undefined}
      />

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
