'use client'

import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Palette,
  Type,
} from 'lucide-react'
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus'
import { Button } from '@/components/ui/button'
import { useEditor } from '@tiptap/react'
import Dropdown from './Dropdown'

interface BubbleMenuProps {
  editor: ReturnType<typeof useEditor>
}

interface FormatButton {
  name: string
  icon: React.ReactNode
  action: () => void
  isActive: boolean
  isLink?: boolean
}

export default function BubbleMenu({ editor }: BubbleMenuProps) {
  if (!editor) return null

  const formatButtons: FormatButton[] = [
    {
      name: 'bold',
      icon: <Bold className='w-4 h-4' />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      name: 'italic',
      icon: <Italic className='w-4 h-4' />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      name: 'underline',
      icon: <Underline className='w-4 h-4' />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      name: 'link',
      icon: <LinkIcon className='w-4 h-4' />,
      action: () => {
        const url = window.prompt('URL')
        if (url) {
          editor.chain().focus().setLink({ href: url }).run()
        }
      },
      isActive: editor.isActive('link'),
      isLink: true,
    },
  ]

  const textTypeItems = [
    {
      label: 'Text',
      onClick: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
    },
    {
      label: 'Heading 1',
      icon: <Heading1 className='w-4 h-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'Heading 2',
      icon: <Heading2 className='w-4 h-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'Heading 3',
      icon: <Heading3 className='w-4 h-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      label: 'Bullet List',
      icon: <List className='w-4 h-4' />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      label: 'Numbered List',
      icon: <ListOrdered className='w-4 h-4' />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      label: 'Todo List',
      icon: <CheckSquare className='w-4 h-4' />,
      onClick: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList'),
    },
    {
      label: 'Quote',
      icon: <Quote className='w-4 h-4' />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
  ]

  const colorItems = [
    {
      label: 'Purple',
      onClick: () => editor.chain().focus().setColor('#958DF1').run(),
      icon: <div className='w-4 h-4 rounded-full bg-[#958DF1]' />,
    },
    {
      label: 'Red',
      onClick: () => editor.chain().focus().setColor('#F98181').run(),
      icon: <div className='w-4 h-4 rounded-full bg-[#F98181]' />,
    },
    {
      label: 'Orange',
      onClick: () => editor.chain().focus().setColor('#FBBC88').run(),
      icon: <div className='w-4 h-4 rounded-full bg-[#FBBC88]' />,
    },
    {
      label: 'Yellow',
      onClick: () => editor.chain().focus().setColor('#FAF594').run(),
      icon: <div className='w-4 h-4 rounded-full bg-[#FAF594]' />,
    },
    {
      label: 'Blue',
      onClick: () => editor.chain().focus().setColor('#70CFF8').run(),
      icon: <div className='w-4 h-4 rounded-full bg-[#70CFF8]' />,
    },
    {
      label: 'Teal',
      onClick: () => editor.chain().focus().setColor('#94FADB').run(),
      icon: <div className='w-4 h-4 rounded-full bg-[#94FADB]' />,
    },
    {
      label: 'Green',
      onClick: () => editor.chain().focus().setColor('#B9F18D').run(),
      icon: <div className='w-4 h-4 rounded-full bg-[#B9F18D]' />,
    },
    {
      label: 'Reset Color',
      onClick: () => editor.chain().focus().unsetColor().run(),
    },
  ]

  return (
    <TiptapBubbleMenu
      editor={editor}
      shouldShow={({ editor, view, state, oldState, from, to }) => {
        // Don't show when link dialog is open
        // if (isLinkDialogOpen) return false

        // Only show when there's a selection
        return from !== to
      }}
      updateDelay={100}
    >
      <div className='flex items-center gap-1 p-1 bg-background border rounded-md shadow-sm'>
        {/* Format Buttons */}
        {formatButtons.map((button) => (
          <Button
            key={button.name}
            variant='ghost'
            size='sm'
            onClick={button.action}
            className={`h-8 w-8 p-0 ${
              button.isActive ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            {button.icon}
          </Button>
        ))}

        {/* Text Type Dropdown */}
        <Dropdown
          trigger={<Type className='w-4 h-4' />}
          items={textTypeItems}
          align='start'
        />

        {/* Color Picker Dropdown */}
        <Dropdown
          trigger={<Palette className='w-4 h-4' />}
          items={colorItems}
          align='start'
        />
      </div>
    </TiptapBubbleMenu>
  )
}
