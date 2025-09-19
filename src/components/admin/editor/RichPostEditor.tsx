'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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
import { extractFirstImageFromHTML, isEmptyContent } from '@/lib/utils/post'
import {
  clearImageDropHandler,
  CustomImage,
  setImageDropHandler,
} from './CustomImageExtension'
import { useImageUpload } from '@/hooks/useImageUpload'
import { toast } from 'sonner'

interface RichPostEditorProps {
  post: Partial<Post>
  onChange: (post: Partial<Post>) => void
  onImageUpload?: (imageUrl: string) => void
  disabled?: boolean
}

function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center'>
      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
    </div>
  )
}

export default function RichPostEditor({
  post,
  onChange,
  onImageUpload,
  disabled = false,
}: RichPostEditorProps) {
  const [showImageUpload, setShowImageUpload] = useState(false)
  const { uploadImage, isUploading, uploadProgress } = useImageUpload()
  const editorRef = useRef<HTMLDivElement>(null)

  // Handle image drops
  const handleImageDrop = useCallback(
    async (files: File[], view: any) => {
      for (const file of files) {
        try {
          const imageUrl = await uploadImage(file)

          // Insert image at current cursor position
          const { state, dispatch } = view
          const { tr } = state
          const { from } = state.selection

          tr.insert(from, state.schema.nodes.image.create({ src: imageUrl }))
          dispatch(tr)

          // Notify parent component for tracking
          if (onImageUpload) {
            onImageUpload(imageUrl)
          }
        } catch (error) {
          toast.message('Failed to upload image.', {
            description:
              typeof error === 'object' && error && 'message' in error
                ? (error as { message: string }).message
                : 'An error occurred',
          })
        }
      }
    },
    [uploadImage, onImageUpload]
  )

  // Register the drop handler
  useEffect(() => {
    setImageDropHandler({ onImageDrop: handleImageDrop })

    return () => {
      clearImageDropHandler()
    }
  }, [handleImageDrop])

  // Drag and drop visual feedback
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault()
        const editorElement = editorRef.current
        editorElement?.classList.add('drag-over')
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      const editorElement = editorRef.current
      editorElement?.classList.remove('drag-over')
    }

    const handleDrop = (e: DragEvent) => {
      const editorElement = editorRef.current
      editorElement?.classList.remove('drag-over')
    }

    const editorElement = editorRef.current
    if (editorElement) {
      editorElement.addEventListener(
        'dragover',
        handleDragOver as EventListener
      )
      editorElement.addEventListener(
        'dragleave',
        handleDragLeave as EventListener
      )
      editorElement.addEventListener('drop', handleDrop as EventListener)
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener(
          'dragover',
          handleDragOver as EventListener
        )
        editorElement.removeEventListener(
          'dragleave',
          handleDragLeave as EventListener
        )
        editorElement.removeEventListener('drop', handleDrop as EventListener)
      }
    }
  }, [])

  // Extract first image from content for the post img field
  const extractFirstImage = useCallback((html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const firstImg = doc.querySelector('img')
    return firstImg?.src || ''
  }, [])

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
      CustomImage.configure({
        // Use the custom image extension
        HTMLAttributes: {
          class: 'rounded-lg max-w-full cursor-pointer',
          draggable: 'false', // Prevent native drag behavior
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
      handleDrop: (view, event, slice, moved) => {
        // Let our custom plugin handle image drops
        if (event.dataTransfer?.files.length) {
          return false // Return false to let our plugin handle it
        }
        return false
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      // Always update state to ensure images are captured
      const firstImage = extractFirstImage(content)

      onChange({
        ...post,
        content,
        img: firstImage,
      })
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && post.content === '' && editor.getHTML() !== '') {
      editor.commands.clearContent()
    }
  }, [post.content, editor])

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
    // Notify parent component about the image upload
    if (onImageUpload) {
      onImageUpload(url)
    }
  }

  return (
    <div className='space-y-4'>
      {/* Title */}
      <Input
        placeholder='Title'
        value={post.title || ''}
        onChange={(e) => onChange({ ...post, title: e.target.value })}
        className='text-4xl font-bold border-0 px-0 py-8 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none'
        style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }}
        disabled={disabled}
      />

      {/* Toolbar */}
      <Toolbar editor={editor} onImageUpload={() => setShowImageUpload(true)} />

      {/* Bubble Menu */}
      {editor && <BubbleMenu editor={editor} />}

      {/* Editor with overlay */}
      <div className='relative'>
        <div
          ref={editorRef}
          className='min-h-[400px] text-lg leading-relaxed outline-none transition-all duration-200'
        >
          <EditorContent
            editor={editor}
            className='min-h-[50vh] prose prose-lg max-w-none'
          />
        </div>

        {/* Upload overlay */}
        {isUploading && (
          <div className='absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg'>
            <div className='text-center p-4 bg-background rounded-lg shadow-lg'>
              <LoadingSpinner />
              <p className='mt-2 text-sm text-muted-foreground'>
                Uploading images... {Math.round(uploadProgress)}%
              </p>
            </div>
          </div>
        )}
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
