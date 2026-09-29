'use client'

import { useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { Placeholder, Dropcursor } from '@tiptap/extensions'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Blockquote from '@tiptap/extension-blockquote'
import axios from 'axios'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Toolbar from '@/components/admin/editor/Toolbar'
import BubbleMenu from '@/components/admin/editor/BubbleMenu'

const MIN_BIO_WORDS = 10
const MAX_BIO_WORDS = 1000

function countWords(text: string) {
  const trimmedText = text.trim()
  return trimmedText ? trimmedText.split(/\s+/).length : 0
}

interface AboutEditorProps {
  initialBio?: string | null
  onCancel: () => void
  onSaved: (bio: string) => void
}

export default function AboutEditor({
  initialBio,
  onCancel,
  onSaved,
}: AboutEditorProps) {
  const [content, setContent] = useState(initialBio || '')
  const [saving, setSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: 'list-disc ml-6' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal ml-6' } },
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Underline,
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      Blockquote.configure({
        HTMLAttributes: { class: 'border-l-4 border-gray-300 pl-4 my-4' },
      }),
      Dropcursor.configure({ width: 2, color: '#958DF1' }),
      Placeholder.configure({
        placeholder: 'Write a bit about yourself...',
      }),
    ],
    content: initialBio || '',
    editorProps: {
      attributes: {
        class: 'min-h-[40vh] rounded-md py-4 px-3 prose prose-lg max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    immediatelyRender: false,
  })

  const wordCount = countWords(editor?.getText() || content)
  const isWordCountValid =
    wordCount >= MIN_BIO_WORDS && wordCount <= MAX_BIO_WORDS

  const handleSave = async () => {
    if (!isWordCountValid) {
      toast.error('Bio word count is invalid', {
        description: `Use between ${MIN_BIO_WORDS} and ${MAX_BIO_WORDS} words.`,
      })
      return
    }

    setSaving(true)
    try {
      await axios.put('/api/profile', { bio: content })
      toast.success('Bio updated', {
        description: 'The "a bit about me" section is now live.',
      })
      onSaved(content)
      onCancel()
    } catch (err) {
      console.error('Failed to save bio', err)
      toast.error('Failed to save', {
        description: 'Something went wrong while saving your bio.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto px-6 lg:px-12 py-8 relative'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          A bit about me
        </h1>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' onClick={onCancel} className='gap-2'>
            <ArrowLeft className='w-4 h-4' />
            Cancel
          </Button>
          <Button
            size='sm'
            onClick={handleSave}
            disabled={saving || !isWordCountValid}
            className='gap-2 bg-black text-white hover:bg-beige hover:text-foreground transition-all'
          >
            {saving ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Save className='w-4 h-4' />
            )}
            Save changes
          </Button>
        </div>
      </div>

      <p className='text-muted-foreground mb-6'>
        This is the text visitors see on your homepage. Edits here go live as
        soon as you save.
      </p>

      <Toolbar editor={editor} onImageUpload={null} />
      {editor && <BubbleMenu editor={editor} />}
      <div
        ref={editorRef}
        className='min-h-[300px] text-base leading-relaxed outline-none border border-border rounded-md'
      >
        <EditorContent
          editor={editor}
          className='min-h-[40vh] prose prose-lg max-w-none'
        />
      </div>
      <p className='mt-2 text-sm text-muted-foreground'>
        {wordCount} / {MAX_BIO_WORDS} words
        {wordCount < MIN_BIO_WORDS && ` (minimum ${MIN_BIO_WORDS})`}
      </p>
    </div>
  )
}
