'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'

interface VoiceInputProps {
  onSendMessage: (message: string) => void
  isListening: boolean
  onStartListening: () => void
  onStopListening: () => void
  isLoading: boolean
  micVolume?: number
  error?: string | null
  onClearError?: () => void
}

export function VoiceInput({
  onSendMessage,
  isListening,
  onStartListening,
  onStopListening,
  isLoading,
  micVolume = 0,
  error,
  onClearError,
}: VoiceInputProps) {
  const [input, setInput] = useState('')

  const getFriendlyErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'no-speech':
        return 'Could not hear anything. Please try again!'
      case 'audio-capture':
        return 'Microphone error. Check your permissions.'
      case 'not-allowed':
        return 'Permission denied. Allow microphone access.'
      case 'network':
        return 'Connection error. Check your internet.'
      case 'aborted':
        return 'Voice search canceled.'
      case 'not-supported':
        return 'Voice input is not supported in this browser.'
      default:
        return 'Something went wrong. Please try again!'
    }
  }

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      const errorMessage = getFriendlyErrorMessage(error)
      toast.error(errorMessage)
      
      // Clear error after showing
      if (onClearError) {
        onClearError()
      }
    }
  }, [error, onClearError])

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='flex gap-2 items-end'>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder='Type or use voice...'
        disabled={isLoading || isListening}
        className='flex-1'
      />

      <div className='relative'>
        <Button
          size='icon'
          variant={isListening ? 'destructive' : 'outline'}
          aria-label={
            isListening ? 'Listening... Click to stop' : 'Voice Search'
          }
          className={cn(
            'transition-all relative z-10',
            isListening
              ? 'bg-beige/50 hover:bg-beige/60 focus-visible:ring-beige/50'
              : 'border border-gray-200  hover:bg-beige focus-visible:ring-gray-200'
          )}
          onClick={isListening ? onStopListening : onStartListening}
          disabled={isLoading}
        >
          <motion.div
            animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{
              duration: isListening ? 1.5 : 0.2,
              repeat: isListening ? Number.POSITIVE_INFINITY : 0,
              ease: 'easeInOut',
            }}
          >
            <AnimatePresence>
              {!isListening ? (
                <>
                  <Mic className='text-gray-400 hover:text-black' />
                </>
              ) : (
                <motion.div
                  key='fx'
                  className='pointer-events-none absolute inset-0'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <motion.div
                    className='absolute inset-0 rounded-[0.75rem] border border-beige/40'
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0.2, 0.8] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className='absolute inset-0 rounded-[0.75rem] border border-beige/30'
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                      delay: 0.3,
                    }}
                  />
                  <motion.div
                    className='absolute inset-0 rounded-[0.75rem] border border-beige/20'
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.05, 0.4] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                      delay: 0.6,
                    }}
                  />

                  <div className='absolute inset-0 flex items-center justify-center gap-1'>
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className='w-0.5 border border-black rounded-full bg-black'
                        animate={{ height: [4, 16, 8, 20, 4] }}
                        transition={{
                          duration: 1.2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'easeInOut',
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Button>
      </div>

      <Button
        size='icon'
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        title='Send message'
      >
        <Send className='w-4 h-4' />
      </Button>
    </div>
  )
}