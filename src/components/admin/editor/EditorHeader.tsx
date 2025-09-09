'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onSave(false)}
            disabled={saving}
          >
            <Save className='w-4 h-4 mr-2' />
            Save Draft
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='sm' disabled={saving}>
                {post.published ? 'Update' : 'Publish'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onSave(true)}>
                <Eye className='w-4 h-4 mr-2' />
                Publish now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSave(false)}>
                <Save className='w-4 h-4 mr-2' />
                Save as draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
