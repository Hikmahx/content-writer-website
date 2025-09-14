'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DropdownItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  isActive?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'start' | 'center' | 'end'
}

export default function Dropdown({ trigger, items, align = 'start' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-2 gap-1',
          isOpen && 'bg-accent text-accent-foreground'
        )}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
      >
        {trigger}
        <ChevronDown className="w-3 h-3" />
      </Button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-1 bg-background border rounded-md shadow-lg z-50 min-w-[160px] py-1',
            alignmentClasses[align]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, index) => (
            <button
              key={index}
              className={cn(
                'w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors',
                item.isActive && 'bg-accent text-accent-foreground'
              )}
              onClick={(e) => {
                e.stopPropagation()
                item.onClick()
                setIsOpen(false)
              }}
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}