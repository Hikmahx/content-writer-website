'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'
import { VoiceInput } from './VoiceInput'
import { Trash2 } from 'lucide-react'
import { useAiChat } from '@/hooks/useAiChat'

interface ChatContentProps {
  onClose: () => void
}

export function ChatContent({ onClose }: ChatContentProps) {
  const {
    messages,
    isLoading,
    isListening,
    micVolume,
    error,
    sendMessage,
    startListening,
    stopListening,
    clearError,
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
    <>
      {/* Messages Area */}
      <ScrollArea className='flex-1 px-4'>
        <div className='space-y-4 py-4 pb-28'>
          {messages.length === 0 ? (
            <div className='flex items-center justify-center h-full text-center text-gray-500 py-8'>
              <div>
                <p className='font-semibold mb-2'>Hi there!</p>
                <p className='text-sm'>
                  Ask me anything about Sarah's professional background,
                  experience, and achievements.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}
              {isLoading && (
                <div className='flex flex-row items-center gap-2 px-2 py-1'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-beige' />
                  <div className='text-sm text-muted-foreground'>
                    Thinking
                    <span className='inline-flex w-[3ch] justify-start overflow-hidden'>
                      <span className='animate-ellipsis'>...</span>
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className='border-t p-4 bg-gray-100 absolute bottom-0 inset-x-0 w-full'>
        <div className='flex gap-2 mb-3'>
          {messages.length > 0 && (
            <Button
              size='sm'
              variant='outline'
              onClick={clearChat}
              className='text-gray-400 text-xs bg-transparent'
            >
              <Trash2 className='w-3 h-3 mr-1' />
              Clear
            </Button>
          )}
        </div>
        <VoiceInput
          onSendMessage={sendMessage}
          isListening={isListening}
          onStartListening={startListening}
          onStopListening={stopListening}
          isLoading={isLoading}
          micVolume={micVolume}
          error={error}
          onClearError={clearError}
        />
      </div>
    </>
  )
}
