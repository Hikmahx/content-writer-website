'use client'

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ImageIcon,
  Link as LinkIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Level } from '@tiptap/extension-heading'
import type { Editor } from '@tiptap/react'
import type { ComponentType } from 'react'

interface ToolbarProps {
  editor: Editor | null
  onImageUpload: () => void
}

// Union type for actions
type DividerAction = { type: 'divider' }
type ButtonAction = {
  type: 'button'
  icon: ComponentType<{ className?: string }>
  isActive: () => boolean
  onClick: () => void
}
type Action = DividerAction | ButtonAction

export default function Toolbar({ editor, onImageUpload }: ToolbarProps) {
  if (!editor) return null

  const actions: Action[] = [
    {
      type: 'button',
      icon: Bold,
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      type: 'button',
      icon: Italic,
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    { type: 'divider' },
    {
      type: 'button',
      icon: Heading1,
      isActive: () => editor.isActive('heading', { level: 1 }),
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleHeading({ level: 1 as Level })
          .run(),
    },
    {
      type: 'button',
      icon: Heading2,
      isActive: () => editor.isActive('heading', { level: 2 }),
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleHeading({ level: 2 as Level })
          .run(),
    },
    { type: 'divider' },
    {
      type: 'button',
      icon: List,
      isActive: () => editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      type: 'button',
      icon: ImageIcon,
      isActive: () => false,
      onClick: onImageUpload,
    },
    {
      type: 'button',
      icon: LinkIcon,
      isActive: () => editor.isActive('link'),
      onClick: () => {
        const url = window.prompt('Enter URL')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      },
    },
  ]

  return (
    <div className='sticky top-14 bg-white z-20 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-2 mb-6'>
      <div className='flex items-center gap-1'>
        {actions.map((action, i) =>
          action.type === 'divider' ? (
            <div key={i} className='w-px h-6 bg-border mx-2' />
          ) : (
            <Button
              key={i}
              variant='ghost'
              size='sm'
              onClick={action.onClick}
              className={`h-8 w-8 p-0 ${
                action.isActive() ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <action.icon className='w-4 h-4' />
            </Button>
          )
        )}
      </div>
    </div>
  )
}
