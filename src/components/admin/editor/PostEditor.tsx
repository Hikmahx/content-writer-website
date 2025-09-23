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
  const [savingType, setSavingType] = useState<'draft' | 'publish' | null>(null)
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
        if (initialLoadRef.current) {
          const shouldRemoveDraft = !hasRealContent(draftPost)
          if (shouldRemoveDraft) {
            removeDraft()
          }
        }
        initialLoadRef.current = false
        return
      }

      // Only fetch if we have a postSlug and we're in initial load
      if (initialLoadRef.current) {
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
    }

    fetchData()
  }, [postSlug])

  const handleSave = async (published: boolean) => {
    if (!post.title?.trim()) {
      toast.error('Title is required')
      return
    }

    if (published && !post.content?.trim()) {
      toast.error('Content is required to publish')
      return
    }

    setSaving(true)
    setSavingType(published ? 'publish' : 'draft')

    try {
      if (post.content) {
        const usedImages = extractImageUrlsFromHTML(post.content)
        const imagesToCleanup = allUploadedImages.filter(
          (url) => !usedImages.includes(url)
        )
        if (imagesToCleanup.length > 0) {
          await cleanupAllImages(imagesToCleanup)
        }
      }

      const newSlug = post.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')

      const postData = {
        ...post,
        published,
        slug: newSlug,
        description:
          post.description || extractTextFromHTML(post.content || ''),
      }

      const savedPost = await savePost(postData, postSlug)
      setPost(savedPost)

      if (savedPost.content) {
        setAllUploadedImages(extractImageUrlsFromHTML(savedPost.content))
      }

      removeDraft()

      toast.success(
        `${published ? 'Post' : 'Draft'} ${
          post.id ? 'updated' : published ? 'published' : 'saved'
        }!`
      )
      
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post')
    } finally {
      setSaving(false)
      setSavingType(null)
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    setAllUploadedImages((prev) => [...prev, imageUrl])
  }

  const handleClearDraft = async () => {
    setClearing(true)
    try {
      if (post.content && !isEmptyContent(post.content)) {
        const images = extractImageUrlsFromHTML(post.content)
        if (images.length > 0) {
          await cleanupAllImages(images)
        }
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

  // Check if we should show clear draft button
  const shouldShowClearDraft = !postSlug && hasRealContent(post)

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
        savingType={savingType}
        clearing={clearing}
        onSave={handleSave}
        onClearDraft={shouldShowClearDraft ? handleClearDraft : undefined}
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
