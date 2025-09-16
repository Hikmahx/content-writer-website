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

interface ToolbarProps {
  editor: Editor | null
  onImageUpload: () => void
}

export default function Toolbar({ editor, onImageUpload }: ToolbarProps) {
  if (!editor) return null

  const setBold = () => editor.chain().focus().toggleBold().run()
  const setItalic = () => editor.chain().focus().toggleItalic().run()
  const setHeading = (level: Level) =>
    editor.chain().focus().toggleHeading({ level }).run()
  const setBulletList = () => editor.chain().focus().toggleBulletList().run()
  const setLink = () => {
    const url = window.prompt('Enter URL')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className='sticky top-10 bg-white z-20 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-2 mb-6'>
      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='sm'
          onClick={setBold}
          className={`h-8 w-8 p-0 ${
            editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Bold className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={setItalic}
          className={`h-8 w-8 p-0 ${
            editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Italic className='w-4 h-4' />
        </Button>
        <div className='w-px h-6 bg-border mx-2' />
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setHeading(1)}
          className={`h-8 w-8 p-0 ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-accent text-accent-foreground'
              : ''
          }`}
        >
          <Heading1 className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setHeading(2)}
          className={`h-8 w-8 p-0 ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-accent text-accent-foreground'
              : ''
          }`}
        >
          <Heading2 className='w-4 h-4' />
        </Button>
        <div className='w-px h-6 bg-border mx-2' />
        <Button
          variant='ghost'
          size='sm'
          onClick={setBulletList}
          className={`h-8 w-8 p-0 ${
            editor.isActive('bulletList')
              ? 'bg-accent text-accent-foreground'
              : ''
          }`}
        >
          <List className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={onImageUpload}
          className='h-8 w-8 p-0'
        >
          <ImageIcon className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={setLink}
          className={`h-8 w-8 p-0 ${
            editor.isActive('link') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <LinkIcon className='w-4 h-4' />
        </Button>
      </div>
    </div>
  )
}
