'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eye, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Post } from '@/lib/types'
import { toast } from 'sonner'

interface EditorHeaderProps {
  post: Partial<Post>
  saving: boolean
  clearing?: boolean
  onSave: (published: boolean) => void
  onClearDraft?: () => void
}

export default function EditorHeader({
  post,
  saving,
  clearing = false,
  onSave,
  onClearDraft,
}: EditorHeaderProps) {
  const isEditMode = !!post.id
  const hasContent = post.title || post.content

  const handleSaveDraft = () => {
    if (!post.title?.trim()) {
      toast.error('Title required', {
        description: 'Please add a title before saving',
      })
      return
    }
    onSave(false)
  }

  const handlePublish = () => {
    if (!post.title?.trim() || !post.content?.trim()) {
      toast.error('Cannot publish', {
        description: 'Title and content are required to publish',
      })
      return
    }
    onSave(true)
  }

  return (
    <header className='sticky top-0 z-20 bg-white backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin'>
            <Button variant='ghost' size='sm' className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Back
            </Button>
          </Link>

          <div className='text-sm text-muted-foreground'>
            {saving ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='w-3 h-3 animate-spin' />
                Saving...
              </span>
            ) : clearing ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='w-3 h-3 animate-spin' />
                Clearing...
              </span>
            ) : post.published ? (
              <span className='text-green-600'>Published</span>
            ) : (
              'Draft'
            )}
            {isEditMode && ' • Editing'}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {onClearDraft && hasContent && (
            <Button
              variant='outline'
              size='sm'
              onClick={onClearDraft}
              disabled={saving || clearing}
              className='gap-2'
            >
              Clear Draft
            </Button>
          )}

          <Button
            variant='outline'
            size='sm'
            onClick={handleSaveDraft}
            disabled={saving || clearing || !post.title}
            className='gap-2'
          >
            {saving ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Save className='w-4 h-4' />
            )}
            Save Draft
          </Button>

          {(!isEditMode || !post.published) && (
            <Button
              size='sm'
              onClick={handlePublish}
              disabled={saving || clearing || !post.title || !post.content}
              className='gap-2'
            >
              <Eye className='w-4 h-4' />
              {isEditMode ? 'Publish Now' : 'Publish'}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
