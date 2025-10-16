'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Experience, Education, PersonalInfo, Resume } from '@/lib/types'
import {
  getResumeDataById,
  saveResumeData,
  deleteResumeData,
} from '@/lib/resume'
import { toast } from 'sonner'
import EducationTab from './dialog/EducationTab'
import PersonalInfoTab from './dialog/PersonalInfoTab'
import ExperienceTab from './dialog/ExperienceTab'
import { formatDateForInput } from '@/lib/utils/date'

interface ResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExpSubmit: (data: {
    experiences: Experience[]
    education: Education[]
    personalInfo: PersonalInfo
  }) => void
  experience?: Experience | null
  personalInfo: PersonalInfo
  education: Education[]
  setResume: React.Dispatch<React.SetStateAction<Resume>>
}

export function ResumeDialog({
  open,
  onOpenChange,
  onExpSubmit,
  experience,
  personalInfo,
  education,
  setResume,
}: ResumeDialogProps) {
  const [loading, setLoading] = useState(false)
  const [initialExperience, setInitialExperience] =
    useState<Partial<Experience> | null>(null)
  const successToastShownRef = useRef(false)

  useEffect(() => {
    if (open) successToastShownRef.current = false
  }, [open])

  useEffect(() => {
    const loadExperienceData = async () => {
      if (open && experience?.id) {
        setLoading(true)
        try {
          const data: any = await getResumeDataById('experience', experience.id)
          const experienceData = data?.experience || experience

          const formattedExperience = {
            ...experienceData,
            startDate: experienceData.startDate
              ? formatDateForInput(experienceData.startDate)
              : '',
            endDate: experienceData.endDate
              ? formatDateForInput(experienceData.endDate)
              : '',
          }

          setInitialExperience(formattedExperience)
        } catch (error) {
          console.error('Failed to load experience:', error)

          const formattedExperience = {
            ...experience,
            startDate: experience.startDate
              ? formatDateForInput(experience.startDate)
              : '',
            endDate: experience.endDate
              ? formatDateForInput(experience.endDate)
              : '',
          }
          setInitialExperience(formattedExperience)
        } finally {
          setLoading(false)
        }
      } else if (open) {
        // Reset for new experience
        setInitialExperience({
          organization: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          responsibilities: [''],
        })
      }
    }

    loadExperienceData()
  }, [open, experience])

  const handleFormSubmit = async (
    type: 'experience' | 'education' | 'personalInfo',
    formData: Partial<Experience> | Education[] | Partial<PersonalInfo>
  ) => {
    setLoading(true)
    try {
      let data: Resume

      if (type === 'education') {
        // Save each education entry
        const educationArray = formData as Education[]

        if (educationArray.length === 0) {
          throw new Error('At least one education entry is required')
        }

        let lastSavedData: Resume | null = null

        for (const edu of educationArray) {
          const id = edu.id
          const isEdit = Boolean(id && id.trim() !== '')

          // Create a clean copy without empty ID for new entries
          const educationData: Partial<Education> = { ...edu }
          if (!isEdit) {
            delete educationData.id
          }

          lastSavedData = await saveResumeData(
            educationData,
            'education',
            isEdit ? id : undefined
          )
        }

        data = lastSavedData as Resume

        if (!successToastShownRef.current) {
          toast.success('Education entries saved successfully')
          successToastShownRef.current = true
        }
      } else {
        // Handle single entries (experience, personalInfo)
        const singleFormData = formData as
          | Partial<Experience>
          | Partial<PersonalInfo>
        const id =
          type === 'experience'
            ? (experience as Experience)?.id
            : (personalInfo as PersonalInfo)?.id

        const isEdit = Boolean(id)
        data = await saveResumeData(
          singleFormData,
          type,
          isEdit ? id : undefined
        )

        if (!successToastShownRef.current) {
          const label = type === 'experience' ? 'Experience' : 'Personal info'
          toast.success(`${label} ${isEdit ? 'updated' : 'added'} successfully`)
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) setInitialExperience(null)
      }}
    >
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {experience ? 'Edit Experience' : 'Add New Experience'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='experience' className='w-full'>
          <TabsList className='w-full p-0 bg-background justify-start border-b rounded-none'>
            <TabsTrigger value='experience' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>Experience</TabsTrigger>
            <TabsTrigger value='personal' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>Personal Info</TabsTrigger>
            <TabsTrigger value='education' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>Education</TabsTrigger>
          </TabsList>

          <ExperienceTab
            initialData={initialExperience}
            loading={loading}
            experience={experience}
            onOpenChange={onOpenChange}
            onSubmit={(formData) => handleFormSubmit('experience', formData)}
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
