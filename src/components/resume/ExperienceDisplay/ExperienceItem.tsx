'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import DeleteModal from '@/components/global/DeleteModal'
import { deleteResumeData } from '@/lib/resume'
import { toast } from 'sonner'
import type { Experience, Resume } from '@/lib/types'
import { formatDateRange } from '@/lib/utils/date'

interface ExperienceItemProps {
  exp: Experience
  index: number
  isAdmin: boolean
  onEditExperience?: (experience: Experience) => void
  setResume: React.Dispatch<React.SetStateAction<Resume>>
  experienceRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>
  dotRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>
  connectedDots: Set<string>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function ExperienceItem({
  exp,
  index,
  isAdmin,
  onEditExperience,
  setResume,
  experienceRefs,
  dotRefs,
  connectedDots,
  setError,
}: ExperienceItemProps) {


  return (
    <div
      key={exp.id}
      ref={(el) => {
        experienceRefs.current[exp.id] = el
      }}
      className={`relative flex items-start group cursor-pointer ${
        index % 2 === 1 ? 'flex-row' : 'lg:flex-row-reverse'
      }`}
    >
      {/* Timeline Dot */}
      <div
        ref={(el) => {
          dotRefs.current[exp.id] = el
        }}
        className='absolute lg:left-1/2 transform lg:-translate-x-1/2 z-2k'
      >
        <div
          className={`w-3 h-3 rounded-full transition-all duration-500 ${
            connectedDots.has(exp.id)
              ? 'bg-beige shadow-lg scale-125'
              : 'bg-beige/90'
          }`}
        />
      </div>

      {/* Experience Card */}
      <div
        className={`w-full lg:w-2/3 ${index % 2 === 1 ? 'lg:pr-5' : 'lg:pl-5'}`}
      >
        <div className='px-6 hover:-translate-y-2 transition-all duration-300'>
          <div className='mb-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-foreground text-lg mb-1'>
                {exp.organization}
              </h3>
              <p>{exp.location}</p>
            </div>
            <div className='flex items-center justify-between italic text-xs'>
              <p className='text-muted-foreground font-medium mb-2'>
                {exp.position}
              </p>
              <p>{formatDateRange(exp.startDate, exp.endDate)}</p>
            </div>
          </div>

          <ul
            className={`space-y-2 text-sm text-muted-foreground ${
              // index % 2 === 1 ? 'text-right' :
              'text-left'
            }`}
          >
            {exp.responsibilities.map((responsibility, bulletIndex) => (
              <li key={bulletIndex} className='flex items-start'>
                <>
                  <span className='text-beige mr-2'>•</span>
                  <span className='flex-1'>{responsibility}</span>
                </>
              </li>
            ))}
          </ul>

          {/* Admin buttons */}
          {isAdmin && onEditExperience && (
            <div
              className={`flex gap-2 mt-4 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                index % 2 === 1 ? 'lg:justify-end' : 'justify-start'
              }`}
            >
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onEditExperience(exp)}
                className='h-8 px-2'
              >
                <Edit className='w-3 h-3' />
              </Button>
              <DeleteModal
                itemName={exp.organization}
                onDelete={async () => {
                  try {
                    const data = await deleteResumeData('experience', exp.id)
                    setResume(data)
                    toast.message('Experience deleted successfully')
                  } catch (err) {
                    setError('Failed to delete experience')
                  }
                }}
                trigger={
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 px-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50'
                  >
                    <Trash2 className='w-3 h-3' />
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Empty space for alternating layout */}
      <div className='lg:w-2/3'></div>
    </div>
  )
}
