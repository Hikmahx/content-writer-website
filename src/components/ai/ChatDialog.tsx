'use client'

import { useEffect, useRef } from 'react'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'
import { VoiceInput } from './VoiceInput'
import { Trash2, X } from 'lucide-react'
import { useAiChat } from '@/hooks/useAiChat'

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const {
    messages,
    isLoading,
    isListening,
    micVolume,
    sendMessage,
    startListening,
    stopListening,
    clearChat,
  } = useAiChat()

  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverContent className='w-full max-w-md h-[600px] flex flex-col p-0 mr-4 mb-4'>
        <div className='flex flex-row items-center justify-between p-4 border-b'>
          <h2 className='font-semibold text-lg'>Chat with Admin</h2>
          <div className='flex gap-2'>
            {messages.length > 0 && (
              <Button
                size='icon'
                variant='ghost'
                onClick={clearChat}
                className='text-gray-400 h-8 w-8'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            )}
            <Button
              size='icon'
              variant='ghost'
              onClick={() => onOpenChange(false)}
              className='text-gray-600 h-8 w-8'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>

        <ScrollArea className='flex-1 px-4'>
          <div className='space-y-4 py-4'>
            {messages.length === 0 ? (
              <div className='flex items-center justify-center h-full text-center text-gray-500'>
                <div>
                  <p className='font-semibold mb-2'>Welcome!</p>
                  <p className='text-sm'>
                    Ask me anything about Sarah's professional background,
                    experience, and achievements.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className='border-t p-4'>
          <VoiceInput
            onSendMessage={sendMessage}
            isListening={isListening}
            onStartListening={startListening}
            onStopListening={stopListening}
            isLoading={isLoading}
            micVolume={micVolume}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
