'use client'

import { useState, useCallback } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import BubbleMenu from './BubbleMenu'
import Toolbar from './Toolbar'
import ImageUpload from './ImageUpload'

interface RichPostEditorProps {
  post: Partial<Post>
  onChange: (post: Partial<Post>) => void
}

export default function RichPostEditor({
  post,
  onChange,
}: RichPostEditorProps) {
  const [showImageUpload, setShowImageUpload] = useState(false)

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
    ],
    content: post.content || '',
    editorProps: {
      attributes: {
        class: 'min-h-[50vh] rounded-md py-4 px-3 prose prose-lg max-w-none',
      },
      transformPastedHTML(html) {
        return html
      },
      transformPastedText(text) {
        return text
      },
    },
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

  const handleImageInsert = (url: string) => {
    // Handle image insertion logic if needed
    console.log('Image inserted:', url)
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
      <Input
        placeholder='Write a brief description...'
        value={post.description || ''}
        onChange={(e) => onChange({ ...post, description: e.target.value })}
        className='text-lg border-0 px-0 py-2 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 resize-none'
      />
      {/* Toolbar */}
      <Toolbar editor={editor} onImageUpload={() => setShowImageUpload(true)} />

      {/* Bubble Menu */}
      {editor && <BubbleMenu editor={editor} />}

      {/* Editor Content */}
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
      <ImageUpload
        open={showImageUpload}
        onOpenChange={setShowImageUpload}
        onImageInsert={handleImageInsert}
        editor={editor}
      />
    </div>
  )
}
