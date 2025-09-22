'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import type { Education, Experience } from '@/lib/types'

interface ExperienceTimelineProps {
  experiences: Experience[]
  education?: Education[]
  onEditExperience?: (experience: Experience) => void
  onDeleteExperience?: (id: string) => void
  onActiveYearChange?: (year: string) => void
  isAdmin?: boolean
}

export function ExperienceTimeline({
  experiences,
  onEditExperience,
  onDeleteExperience,
  onActiveYearChange,
  isAdmin = false,
}: ExperienceTimelineProps) {
  const [activeYear, setActiveYear] = useState<string>('')
  const [connectedDots, setConnectedDots] = useState<Set<string>>(new Set())
  const timelineRef = useRef<HTMLDivElement>(null)
  const yearButtonRef = useRef<HTMLDivElement>(null)
  const experienceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const connectingLineRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Use useMemo to prevent recreation on every render
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
  }, [experiences]) // Only recreate when experiences changes

  // Helper function to get year from date string
  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString()
  }

  // Format date range in the template style
  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
    const startYear = start.getFullYear()

    if (end) {
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
      const endYear = end.getFullYear()
      return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
    }

    return `${startMonth} ${startYear} - Present`
  }

  // Update connecting line position
  const updateConnectingLine = () => {
    if (
      !connectingLineRef.current ||
      !yearButtonRef.current ||
      sortedExperiences.length === 0
    )
      return

    const lastExp = sortedExperiences[sortedExperiences.length - 1]
    const lastDotElement = dotRefs.current[lastExp.id]
    if (!lastDotElement) return

    const timelineRect = timelineRef.current?.getBoundingClientRect()
    if (!timelineRect) return

    const yearButtonRect = yearButtonRef.current.getBoundingClientRect()
    const lastDotRect = lastDotElement.getBoundingClientRect()

    // Center of sticky year button (relative to timeline container)
    const yearButtonCenter =
      yearButtonRect.top - timelineRect.top + yearButtonRect.height / 2

    // Center of last dot (relative to timeline container)
    const lastDotCenter =
      lastDotRect.top - timelineRect.top + lastDotRect.height / 2

    // Set line from year button to last dot center
    connectingLineRef.current.style.top = `${yearButtonCenter}px`
    connectingLineRef.current.style.height = `${
      lastDotCenter - yearButtonCenter
    }px`
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !yearButtonRef.current) return

      const yearButtonRect = yearButtonRef.current.getBoundingClientRect()
      const yearButtonTop = yearButtonRect.top + yearButtonRect.height / 2

      let closestExperience = sortedExperiences[0]
      let minDistance = Number.POSITIVE_INFINITY

      // Find the experience closest to the year button
      sortedExperiences.forEach((exp) => {
        const expElement = experienceRefs.current[exp.id]
        if (expElement) {
          const expRect = expElement.getBoundingClientRect()
          const expCenter = expRect.top + expRect.height / 2
          const distance = Math.abs(expCenter - yearButtonTop)

          if (distance < minDistance) {
            minDistance = distance
            closestExperience = exp
          }
        }
      })

      const year = getYear(closestExperience.startDate)
      setActiveYear(year)
      onActiveYearChange?.(year)

      // Update connected dots based on scroll position
      const newConnectedDots = new Set<string>()
      sortedExperiences.forEach((exp) => {
        const expElement = experienceRefs.current[exp.id]
        if (expElement) {
          const expRect = expElement.getBoundingClientRect()
          const dotPosition = expRect.top + 24 // Approximate dot position

          // Connect dot if it has passed the year button
          if (dotPosition <= yearButtonTop + 10) {
            newConnectedDots.add(exp.id)
          }
        }
      })
      setConnectedDots(newConnectedDots)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sortedExperiences, onActiveYearChange])

  // Update connecting line when experiences change or on resize
  useEffect(() => {
    const handleScrollOrResize = () => updateConnectingLine()

    window.addEventListener('scroll', handleScrollOrResize)
    window.addEventListener('resize', handleScrollOrResize)

    updateConnectingLine() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [sortedExperiences])

  if (experiences.length < 1) {
    return (
      <p className='py-16 flex justify-center text-gray-700 w-full'>
        No experience available yet.
      </p>
    )
  }

  return (
    <div className='min-h-screen bg-background pb-8 px-4 print:hidden'>
      <div className='max-w-4xl mx-auto'>
        {/* Timeline Container */}
        <div ref={timelineRef} className='relative'>
          <div className='sticky bg-white h-8 w-8 top-0 lg:inset-x-0 lg:m-auto z-30'></div>
          {/* Sticky Year Button */}
          <div
            ref={yearButtonRef}
            className='sticky -ml-6 lg:ml-auto top-8 z-10 flex lg:justify-center mb-8'
          >
            <div className='bg-beige text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300'>
              {activeYear}
            </div>
          </div>

          {/* Connecting Line - from year button to bottom dot */}
          <div
            ref={connectingLineRef}
            className='absolute left-1.5 lg:left-1/2 transform -translate-x-1/2 w-px bg-beige z-0'
            style={{ top: '0', height: '0' }}
          />

          {/* Timeline Line (static background line) */}
          <div className='absolute lg:left-1/2 transform -translate-x-px top-0 bottom-0 w-px bg-border z-0'></div>

          {/* Experiences */}
          <div className='space-y-16'>
            {sortedExperiences.map((exp, index) => (
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
                <div className={`w-full lg:w-2/3 ${index % 2 === 1 ? 'lg:pr-5' : 'lg:pl-5'}`}>
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
                      {exp.responsibilities.map(
                        (responsibility, bulletIndex) => (
                          <li key={bulletIndex} className='flex items-start'>
                            {/* {index % 2 === 1 ? (
                              <>
                                <span className='flex-1'>{responsibility}</span>
                                <span className='text-beige ml-2'>•</span>
                              </>
                            ) : ( */}
                            <>
                              <span className='text-beige mr-2'>•</span>
                              <span className='flex-1'>{responsibility}</span>
                            </>
                            {/* )} */}
                          </li>
                        )
                      )}
                    </ul>

                    {/* Admin buttons */}
                    {isAdmin && onEditExperience && onDeleteExperience && (
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
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onDeleteExperience(exp.id)}
                          className='h-8 px-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50'
                        >
                          <Trash2 className='w-3 h-3' />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className='lg:w-2/3'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
