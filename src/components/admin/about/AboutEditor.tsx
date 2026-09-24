'use client'

import { useEffect, useRef, useState } from 'react'
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
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Toolbar from '@/components/admin/editor/Toolbar'
import BubbleMenu from '@/components/admin/editor/BubbleMenu'

export default function AboutEditor() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
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
    content: '',
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

  // Load the current bio on mount
  useEffect(() => {
    let cancelled = false

    const loadBio = async () => {
      try {
        const resp = await axios.get('/api/profile')
        const bio = resp.data.bio || ''
        if (!cancelled) {
          setContent(bio)
          editor?.commands.setContent(bio)
        }
      } catch (err) {
        console.error('Failed to load bio', err)
        toast.error('Failed to load current bio')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (editor) {
      loadBio()
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.put('/api/profile', { bio: content })
      toast.success('Bio updated', {
        description: 'The "a bit about me" section is now live.',
      })
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
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-20 bg-white backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3'>
        <div className='max-w-4xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/admin'>
              <Button variant='ghost' size='sm' className='gap-2'>
                <ArrowLeft className='w-4 h-4' />
                Back
              </Button>
            </Link>
            <div className='text-sm text-muted-foreground'>
              Editing the &quot;a bit about me&quot; section
            </div>
          </div>

          <Button
            size='sm'
            onClick={handleSave}
            disabled={saving || loading}
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
      </header>

      <div className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          A bit about me
        </h1>
        <p className='text-muted-foreground mb-6'>
          This is the text visitors see on your homepage. Edits here go live
          as soon as you save.
        </p>

        {loading ? (
          <div className='flex items-center justify-center py-24'>
            <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
