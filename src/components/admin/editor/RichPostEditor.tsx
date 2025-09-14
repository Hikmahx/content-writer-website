'use client'

import { useState, useCallback } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ImageIcon,
  Link as LinkIcon,
  Upload,
  Strikethrough,
} from 'lucide-react'
import type { Post } from '@/lib/types'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { Placeholder, Dropcursor } from '@tiptap/extensions'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Blockquote from '@tiptap/extension-blockquote'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import type { Level } from '@tiptap/extension-heading'
import BubbleMenu from './BubbleMenu'
interface RichPostEditorProps {
  post: Partial<Post>
  onChange: (post: Partial<Post>) => void
  showImageUpload: boolean
  setShowImageUpload: (show: boolean) => void
  onImageInsert: (url: string) => void
}

export default function RichPostEditor({
  post,
  onChange,
  showImageUpload,
  setShowImageUpload,
  onImageInsert,
}: RichPostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-6',
          },
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 pl-4 my-4',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'list-none ml-6',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start',
        },
        nested: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-8 border-t border-gray-300',
        },
      }),
      Dropcursor.configure({
        width: 2,
        color: '#958DF1',
      }),
      Placeholder.configure({
        placeholder: 'Write your article here...',
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: post.content || '',
    editorProps: {
      attributes: {
        class: 'min-h-[50vh] rounded-md py-4 px-3 prose prose-lg max-w-none',
      },
      // HTML parsing on paste
      transformPastedHTML(html) {
        return html
      },
      // Optional: Handle dropped content too
      transformPastedText(text) {
        return text
      },
    },
    // Enable parsing of HTML content
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onUpdate: ({ editor }) => {
      onChange({ ...post, content: editor.getHTML() })
    },
    immediatelyRender: false,
  })

  // Tags
  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim()
      if (!post.hashtags?.includes(newTag)) {
        onChange({ ...post, hashtags: [...(post.hashtags || []), newTag] })
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

  // Toolbar actions
  const setBold = () => editor?.chain().focus().toggleBold().run()
  const setItalic = () => editor?.chain().focus().toggleItalic().run()
  const setHeading = (level: Level) =>
    editor?.chain().focus().toggleHeading({ level }).run()
  const setBulletList = () => editor?.chain().focus().toggleBulletList().run()
  const setLink = () => {
    const url = window.prompt('Enter URL')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }
  const setImage = () => setShowImageUpload(true)

  // Image upload modal
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = URL.createObjectURL(file)
      onImageInsert(url)
      editor?.chain().focus().setImage({ src: url }).run()
      setShowImageUpload(false)
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
  }
  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      onImageInsert(imageUrl.trim())
      editor?.chain().focus().setImage({ src: imageUrl.trim() }).run()
      setShowImageUpload(false)
    }
  }

  const [showMenu, setShowMenu] = useState(true)

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
      <Input
        placeholder='Write a brief description...'
        value={post.description || ''}
        onChange={(e) => onChange({ ...post, description: e.target.value })}
        className='text-lg border-0 px-0 py-2 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 resize-none'
      />
      {/* Toolbar */}
      <div className='sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-2 mb-6'>
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={setBold}
            className='h-8 w-8 p-0'
          >
            <Bold className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={setItalic}
            className='h-8 w-8 p-0'
          >
            <Italic className='w-4 h-4' />
          </Button>
          <div className='w-px h-6 bg-border mx-2' />
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setHeading(1)}
            className='h-8 w-8 p-0'
          >
            <Heading1 className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setHeading(2)}
            className='h-8 w-8 p-0'
          >
            <Heading2 className='w-4 h-4' />
          </Button>
          <div className='w-px h-6 bg-border mx-2' />
          <Button
            variant='ghost'
            size='sm'
            onClick={setBulletList}
            className='h-8 w-8 p-0'
          >
            <List className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={setImage}
            className='h-8 w-8 p-0'
          >
            <ImageIcon className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={setLink}
            className='h-8 w-8 p-0'
          >
            <LinkIcon className='w-4 h-4' />
          </Button>
        </div>
      </div>
      {editor && <BubbleMenu editor={editor} />}
      {/* TipTap Editor */}
      <div className='min-h-[400px] text-lg leading-relaxed outline-none'>
        <EditorContent editor={editor} className='min-h-[50vh]' />
      </div>
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
                x
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
      {/* Image Upload Modal */}
      {showImageUpload && (
        <Dialog open onOpenChange={() => setShowImageUpload(false)}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  Upload from device
                </label>
                <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
                  <Upload className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
                  <p className='text-sm text-muted-foreground mb-2'>
                    Drag and drop an image, or click to browse
                  </p>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleFileUpload}
                    className='hidden'
                    id='image-upload'
                    disabled={uploading}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      document.getElementById('image-upload')?.click()
                    }
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Choose file'}
                  </Button>
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  Or paste image URL
                </label>
                <div className='flex gap-2'>
                  <Input
                    placeholder='https://example.com/image.jpg'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button onClick={handleUrlInsert} disabled={!imageUrl.trim()}>
                    <Upload className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
