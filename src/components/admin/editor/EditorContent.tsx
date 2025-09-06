'use client'

import type React from 'react'

import { useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { Post } from '@/lib/types'

interface EditorContentProps {
  post: Partial<Post>
  onChange: (post: Partial<Post>) => void
}

export default function EditorContent({ post, onChange }: EditorContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && post.content) {
      contentRef.current.innerHTML = post.content
    }
  }, [])

  const handleContentChange = () => {
    if (contentRef.current) {
      onChange({
        ...post,
        content: contentRef.current.innerHTML,
      })
    }
  }

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim()
      if (!post.hashtags?.includes(newTag)) {
        onChange({
          ...post,
          hashtags: [...(post.hashtags || []), newTag],
        })
      }
      e.currentTarget.value = ''
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    onChange({
      ...post,
      hashtags: post.hashtags?.filter((tag) => tag !== tagToRemove) || [],
    })
  }

  return (
    <div className='space-y-6'>
      {/* Title */}
      <Input
        placeholder='Title'
        value={post.title || ''}
        onChange={(e) => onChange({ ...post, title: e.target.value })}
        className='text-4xl font-bold border-0 px-0 py-4 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0'
        style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }}
      />

      {/* Description */}
      <Textarea
        placeholder='Write a brief description...'
        value={post.description || ''}
        onChange={(e) => onChange({ ...post, description: e.target.value })}
        className='text-lg border-0 px-0 py-2 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 resize-none'
        rows={2}
      />

      {/* Content Editor */}
      <div
        ref={contentRef}
        contentEditable
        onInput={handleContentChange}
        className='min-h-[400px] text-lg leading-relaxed focus:outline-none prose prose-lg max-w-none'
        style={{
          lineHeight: '1.75',
          fontSize: '1.125rem',
        }}
        suppressContentEditableWarning={true}
        data-placeholder='Tell your story...'
      />

      {/* Tags */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-foreground'>Tags</label>
        <div className='flex flex-wrap gap-2 mb-2'>
          {post.hashtags?.map((tag) => (
            <Badge
              key={tag}
              variant='secondary'
              className='flex items-center gap-1'
            >
              #{tag}
              <button
                onClick={() => handleTagRemove(tag)}
                className='ml-1 hover:bg-destructive/20 rounded-full p-0.5'
              >
                <X className='w-3 h-3' />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder='Add a tag and press Enter'
          onKeyDown={handleTagAdd}
          className='max-w-xs'
        />
      </div>
    </div>
  )
}
