'use client'

import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  Loader2,
  Edit,
} from 'lucide-react'
import Link from 'next/link'
import type { Post } from '@/lib/types'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useState, useEffect, useCallback } from 'react'

interface EditorHeaderProps {
  post: Partial<Post>
  saving: boolean
  savingType?: 'draft' | 'publish' | null
  clearing?: boolean
  onSave: (published: boolean) => void
  onClearDraft?: () => void
}

export default function EditorHeader({
  post,
  saving,
  savingType = null,
  clearing = false,
  onSave,
  onClearDraft,
}: EditorHeaderProps) {
  const [lastPublishTime, setLastPublishTime] = useState<Date | null>(null)
  const [canRepublish, setCanRepublish] = useState(true)
  const [justUnpublished, setJustUnpublished] = useState(false)

  const isEditMode = !!post.id
  const isPublished = post.published || false // Ensure boolean

  // Memoize the content check to prevent unnecessary re-renders
  const hasContent = useCallback(() => {
    return !!(post.title?.trim() || post.content?.trim())
  }, [post.title, post.content])

  // Check if user can republish (10-minute cooldown after unpublishing)
  useEffect(() => {
    if (justUnpublished && lastPublishTime) {
      const now = new Date()
      const timeDiff = now.getTime() - lastPublishTime.getTime()
      const tenMinutes = 10 * 60 * 1000

      setCanRepublish(timeDiff >= tenMinutes)

      if (timeDiff < tenMinutes) {
        const timer = setTimeout(() => {
          setCanRepublish(true)
        }, tenMinutes - timeDiff)

        return () => clearTimeout(timer)
      }
    }
  }, [lastPublishTime, justUnpublished])

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
    setJustUnpublished(false) // Reset when publishing
  }

  const handleUnpublish = () => {
    if (!post.title?.trim()) {
      toast.error('Title required')
      return
    }
    onSave(false)
    setLastPublishTime(new Date())
    setJustUnpublished(true)
    setCanRepublish(false)
  }

  const handleTogglePublish = (checked: boolean) => {
    if (checked) {
      // Toggling to publish
      if (justUnpublished && !canRepublish) {
        return // Prevent publishing if cooldown is active
      }
      handlePublish()
    } else {
      // Toggling to unpublish
      handleUnpublish()
    }
  }

  const handleUpdatePost = () => {
    if (!post.title?.trim()) {
      toast.error('Title required')
      return
    }

    if (!post.content?.trim()) {
      toast.error('Content required')
      return
    }

    onSave(isPublished) // Save with current published status
  }

  const getTimeRemaining = () => {
    if (!lastPublishTime || canRepublish) return null

    const now = new Date()
    const timeDiff = now.getTime() - lastPublishTime.getTime()
    const tenMinutes = 10 * 60 * 1000
    const remaining = tenMinutes - timeDiff

    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)

    return `${minutes}m ${seconds}s`
  }

  const timeRemaining = getTimeRemaining()
  const showPublishCooldown = justUnpublished && !canRepublish && timeRemaining

  // Fix disabled logic for switch
  const isSwitchDisabled = Boolean(
    saving ||
      clearing ||
      !post.title ||
      !post.content ||
      (isPublished && showPublishCooldown)
  )

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
                {savingType === 'publish'
                  ? 'Publishing...'
                  : savingType === 'draft'
                  ? 'Saving...'
                  : 'Updating...'}
              </span>
            ) : clearing ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='w-3 h-3 animate-spin' />
                Clearing...
              </span>
            ) : isPublished ? (
              <span className='text-green-600'>Published</span>
            ) : (
              'Draft'
            )}
            {isEditMode && ' • Editing'}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {/* Clear Draft Button - Only show for new posts with content */}
          {onClearDraft && hasContent() && !isEditMode && (
            <Button
              variant='outline'
              size='sm'
              onClick={onClearDraft}
              disabled={saving || clearing}
              className='gap-2'
            >
              <Trash2 className='w-4 h-4' />
              Clear Draft
            </Button>
          )}

          {/* Update buttons for existing posts */}
          {isEditMode && (
            <>
              {/* Update Post/Draft Button */}
              <Button
                variant='outline'
                size='sm'
                onClick={handleUpdatePost}
                disabled={saving || clearing || !post.title || !post.content}
                className='gap-2'
              >
                {saving && savingType === null ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Edit className='w-4 h-4' />
                )}
                {isPublished ? 'Update Post' : 'Update Draft'}
              </Button>

              {/* Publish/Unpublish Toggle */}
              <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={isPublished}
                      onCheckedChange={handleTogglePublish}
                      disabled={isSwitchDisabled}
                    />
                    <span className='text-sm font-medium'>
                      {isPublished ? 'Published' : 'Unpublished'}
                    </span>
                  </div>
                </HoverCardTrigger>
                {showPublishCooldown && (
                  <HoverCardContent className='w-80'>
                    <div className='space-y-2'>
                      <h4 className='text-sm font-semibold'>
                        Publishing Cooldown
                      </h4>
                      <p className='text-sm'>
                        You can publish again in {timeRemaining}. This helps
                        prevent frequent publishing/unpublishing.
                      </p>
                    </div>
                  </HoverCardContent>
                )}
              </HoverCard>
            </>
          )}

          {/* New post buttons */}
          {!isEditMode && (
            <>
              {/* Save Draft Button for new posts */}
              <Button
                variant='outline'
                size='sm'
                onClick={handleSaveDraft}
                disabled={saving || clearing || !post.title}
                className='gap-2'
              >
                {saving && savingType === 'draft' ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )}
                Save Draft
              </Button>

              {/* Publish Button for new posts */}
              <Button
                size='sm'
                onClick={handlePublish}
                disabled={saving || clearing || !post.title || !post.content}
                className='gap-2'
              >
                {saving && savingType === 'publish' ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
                Publish
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
