'use client'

import { type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface AnimatedPopoverProps {
  isOpen: boolean
  onClose: () => void
  trigger: ReactNode
  children: ReactNode
}

export function AnimatedPopover({
  isOpen,
  onClose,
  trigger,
  children,
}: AnimatedPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>{trigger}</div>

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className='fixed bottom-24 right-6 z-50 animate-in fade-in zoom-in-95 duration-200'
            style={{
              animation: isOpen
                ? 'popoverIn 0.3s ease-out'
                : 'popoverOut 0.2s ease-in',
            }}
          >
            <style>{`
              @keyframes popoverIn {
                from {
                  opacity: 0;
                  transform: scale(0.95) translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              @keyframes popoverOut {
                from {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
                to {
                  opacity: 0;
                  transform: scale(0.95) translateY(10px);
                }
              }
            `}</style>
            {children}
          </div>,
          document.body
        )}
    </>
  )
}
