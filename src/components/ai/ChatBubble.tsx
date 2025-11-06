'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { ChatContent } from './ChatContent'
import './chat-bubble.css'

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-beige hover:bg-beige/50 z-40 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95'
        aria-label='Open chat'
      >
        <MessageCircle className='w-6 h-6' />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 z-30'
          onClick={() => setIsOpen(false)}
          aria-hidden='true'
        />
      )}

      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-500 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-75 translate-y-8 pointer-events-none'
        }`}
      >
        <div className='relative'>
          <div className={`speech-bubble bg-white shadow-2xl ml-auto w-[90%] max-w-96 flex flex-col ${isOpen ? 'animate-speech-bubble' : ''}`}>
            <div className='flex items-center justify-end p-4'>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1'
                aria-label='Close chat'
              >
                <X className='w-5 h-5 hover:bg-beige transition-colors' />
              </button>
            </div>

            <div className='flex-1 max-h-[500px] overflow-y-auto'>
              <ChatContent onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
