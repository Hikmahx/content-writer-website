'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, Send, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceInputProps {
  onSendMessage: (message: string) => void
  isListening: boolean
  onStartListening: () => void
  onStopListening: () => void
  isLoading: boolean
  micVolume?: number
}

export function VoiceInput({
  onSendMessage,
  isListening,
  onStartListening,
  onStopListening,
  isLoading,
  micVolume = 0,
}: VoiceInputProps) {
  const [input, setInput] = useState('')
  const [ripples, setRipples] = useState<Array<{ id: string; scale: number }>>(
    []
  )

  useEffect(() => {
    if (!isListening) return

    const rippleScale = 1 + micVolume * 2
    const newRipple = {
      id: Math.random().toString(),
      scale: rippleScale,
    }

    setRipples((prev) => [...prev, newRipple])

    const timer = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)

    return () => clearTimeout(timer)
  }, [micVolume, isListening])

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
        {isListening && ripples.length > 0 && (
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            {ripples.map((ripple) => (
              <div
                key={ripple.id}
                className='absolute rounded-full border-2 border-red-400 animate-pulse'
                style={{
                  width: `${40 * ripple.scale}px`,
                  height: `${40 * ripple.scale}px`,
                  opacity: Math.max(0, 1 - ripple.scale / 3),
                  animation: 'ripple-out 0.6s ease-out forwards',
                }}
              />
            ))}
          </div>
        )}

        <Button
          size='icon'
          variant={isListening ? 'destructive' : 'outline'}
          onClick={isListening ? onStopListening : onStartListening}
          disabled={isLoading}
          className={cn(
            'transition-all relative z-10',
            isListening && 'bg-red-500 hover:bg-red-600 animate-pulse'
          )}
          title={isListening ? 'Stop recording' : 'Start recording'}
        >
          {isListening ? (
            <>
              <Square className='w-4 h-4' />
              <span className='absolute inset-0 rounded-md border-2 border-red-400 animate-pulse' />
            </>
          ) : (
            <Mic className='w-4 h-4' />
          )}
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

      <style>{`
        @keyframes ripple-out {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
