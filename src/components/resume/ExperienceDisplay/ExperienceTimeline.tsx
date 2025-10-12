'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { fetchResumeData, deleteResumeData } from '@/lib/resume'
import { Button } from '@/components/ui/button'
import DeleteModal from '@/components/global/DeleteModal'
import { Edit, Trash2 } from 'lucide-react'
import type { Education, Experience, PersonalInfo, Resume } from '@/lib/types'
import { toast } from 'sonner'
import { ExperienceItem } from './ExperienceItem'

interface ExperienceTimelineProps {
  experiences: Experience[]
  education?: Education[]
  onEditExperience?: (experience: Experience) => void
  onActiveYearChange?: (year: string) => void
  isAdmin?: boolean
  setResume: React.Dispatch<React.SetStateAction<Resume>>
}

export function ExperienceTimeline({
  experiences: initialExperiences,
  onEditExperience,
  onActiveYearChange,
  isAdmin = false,
  setResume,
}: ExperienceTimelineProps) {
  const [experiences, setExperiences] = useState<Experience[]>(
    initialExperiences || []
  )
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeYear, setActiveYear] = useState<string>('')
  const [connectedDots, setConnectedDots] = useState<Set<string>>(new Set())
  const timelineRef = useRef<HTMLDivElement>(null)
  const yearButtonRef = useRef<HTMLDivElement>(null)
  const experienceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const connectingLineRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Fetch experiences from API on mount
  useEffect(() => {
    setLoading(true)
    fetchResumeData()
      .then((data: any) => {
        setExperiences(Array.isArray(data.experiences) ? data.experiences : [])
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError('Failed to load experiences')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (initialExperiences && initialExperiences.length >= 0) {
      setExperiences(initialExperiences)
    }
  }, [initialExperiences])

  // Use useMemo to prevent recreation on every render
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
  }, [experiences])

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString()
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

  if (loading) {
    return (
      <div className='py-16 flex justify-center text-gray-700 w-full'>
        Loading experiences...
      </div>
    )
  }
  if (error) {
    toast.error(error)
  }
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
              <ExperienceItem
                exp={exp}
                index={index}
                isAdmin={isAdmin}
                onEditExperience={onEditExperience}
                setResume={setResume}
                key={index}
                experienceRefs={experienceRefs}
                dotRefs={dotRefs}
                connectedDots={connectedDots}
                setError={setError}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
