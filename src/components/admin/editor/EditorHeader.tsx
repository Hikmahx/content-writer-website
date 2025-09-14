'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import type { Post } from '@/lib/types'

interface EditorHeaderProps {
  post: Partial<Post>
  saving: boolean
  onSave: (published: boolean) => void
}

export default function EditorHeader({
  post,
  saving,
  onSave,
}: EditorHeaderProps) {
  // Check if post has an id (ie already exists in db)
  const isEditMode = !!post.id

  return (
    <header className='sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/blog/posts'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to post
            </Button>
          </Link>

          <div className='text-sm text-muted-foreground'>
            {saving ? 'Saving...' : post.published ? 'Published' : 'Draft'}
            {isEditMode && ' • Editing'}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onSave(post.published ? true : false)}
            disabled={saving}
          >
            <Save className='w-4 h-4 mr-2' />
            {isEditMode
              ? post.published
                ? 'Update Post'
                : 'Update Draft'
              : 'Save Draft'}
          </Button>
          {(!isEditMode || !post.published) && (
            <Button size='sm' onClick={() => onSave(true)} disabled={saving}>
              <Eye className='w-4 h-4 mr-2' />
              {isEditMode ? 'Publish Now' : 'Publish'}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
