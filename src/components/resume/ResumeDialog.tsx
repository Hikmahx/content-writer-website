'use client'

import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Experience, Education, PersonalInfo, Resume } from '@/lib/types'
import { saveResumeData, deleteResumeData } from '@/lib/resume'
import { toast } from 'sonner'
import EducationTab from './dialog/EducationTab'
import PersonalInfoTab from './dialog/PersonalInfoTab'
import ExperienceTab from './dialog/ExperienceTab'

interface ResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExpSubmit: (data: {
    experiences: Experience[]
    education: Education[]
    personalInfo: PersonalInfo
  }) => void
  experiences: Experience[]
  personalInfo: PersonalInfo
  education: Education[]
  setResume: React.Dispatch<React.SetStateAction<Resume>>
}

export function ResumeDialog({
  open,
  onOpenChange,
  onExpSubmit,
  experiences,
  personalInfo,
  education,
  setResume,
}: ResumeDialogProps) {
  const [loading, setLoading] = useState(false)
  const successToastShownRef = useRef(false)

  React.useEffect(() => {
    if (open) successToastShownRef.current = false
  }, [open])

  const handleFormSubmit = async (
    type: 'experience' | 'education' | 'personalInfo',
    formData: Experience[] | Education[] | Partial<PersonalInfo>
  ) => {
    setLoading(true)
    try {
      let data: Resume

      if (type === 'experience' || type === 'education') {
        // Save each entry in the array individually
        const entries = formData as (Experience | Education)[]

        if (entries.length === 0) {
          throw new Error(`At least one ${type} entry is required`)
        }

        let lastSavedData: Resume | null = null

        for (const entry of entries) {
          const id = entry.id
          const isEdit = Boolean(id && id.trim() !== '')

          // Create a clean copy without empty ID for new entries
          const entryData: Partial<Experience | Education> = { ...entry }
          if (!isEdit) {
            delete entryData.id
          }

          lastSavedData = await saveResumeData(
            entryData,
            type,
            isEdit ? id : undefined
          )
        }

        data = lastSavedData as Resume

        if (!successToastShownRef.current) {
          const label = type === 'experience' ? 'Experience' : 'Education'
          toast.success(`${label} entries saved successfully`)
          successToastShownRef.current = true
        }
      } else {
        // Personal info: a single entity
        const singleFormData = formData as Partial<PersonalInfo>
        const id = (personalInfo as PersonalInfo)?.id

        const isEdit = Boolean(id)
        data = await saveResumeData(
          singleFormData,
          type,
          isEdit ? id : undefined
        )

        if (!successToastShownRef.current) {
          toast.success(`Personal info ${isEdit ? 'updated' : 'added'} successfully`)
          successToastShownRef.current = true
        }
      }

      onOpenChange(false)
      setResume(data)
    } catch (err: any) {
      console.error(`Failed to save ${type}:`, err)
      toast.error(`Failed to save ${type}`, {
        description: err?.message || 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (!id) return

    setLoading(true)
    try {
      const data = await deleteResumeData('experience', id)
      setResume(data)
      toast.success('Experience deleted successfully')
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to delete experience', {
        description: err?.message || 'An unexpected error occurred',
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (!id) return

    setLoading(true)
    try {
      const data = await deleteResumeData('education', id)
      setResume(data)
      toast.success('Education deleted successfully')
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to delete education', {
        description: err?.message || 'An unexpected error occurred',
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Manage Resume</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='experience' className='w-full'>
          <TabsList className='w-full p-0 bg-background justify-start border-b rounded-none'>
            <TabsTrigger value='experience' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>
              Experience ({experiences.length})
            </TabsTrigger>
            <TabsTrigger value='personal' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>
              Personal Info
            </TabsTrigger>
            <TabsTrigger value='education' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>
              Education ({education.length})
            </TabsTrigger>
          </TabsList>

          <ExperienceTab
            experiences={experiences}
            loading={loading}
            onOpenChange={onOpenChange}
            onSubmit={(formData) => handleFormSubmit('experience', formData)}
            onDeleteExperience={handleDeleteExperience}
          />

          <PersonalInfoTab
            personalInfo={personalInfo}
            loading={loading}
            onOpenChange={onOpenChange}
            onSubmit={(formData) => handleFormSubmit('personalInfo', formData)}
          />

          <EducationTab
            education={education}
            loading={loading}
            onOpenChange={onOpenChange}
            onSubmit={(formData) => handleFormSubmit('education', formData)}
            onDeleteEducation={handleDeleteEducation}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
