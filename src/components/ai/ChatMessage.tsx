import type { Message } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTypingEffect } from '@/hooks/useTypingEffect'

interface ChatMessageProps {
  message: Message
  typingEffect?: boolean 
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  // Ensure message.content is always a string
  const content = typeof message.content === 'string' ? message.content : ''
  const showTyping = !isUser && typeof window !== 'undefined'
  const displayed = showTyping ? useTypingEffect(content) : content

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm',
          isUser
            ? 'bg-beige/50 rounded-br-none'
            : 'bg-gray-50/50 text-gray-900 rounded-bl-none'
        )}
      >
        <p className='text-sm leading-relaxed'>{displayed}</p>
      </div>
    </div>
  )
}
