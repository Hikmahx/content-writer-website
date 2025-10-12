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
import { getResumeDataById, saveResumeData } from '@/lib/resume'
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
  // onUpdatePersonal: (info: PersonalInfo) => void
  // onUpdateEducation: (education: Education[]) => void
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
}: // onUpdatePersonal,
// onUpdateEducation,
ResumeDialogProps) {
  const [loading, setLoading] = useState(false)
  const [initialExperience, setInitialExperience] =
    useState<Partial<Experience> | null>(null)

  // guard against duplicate toasts (helps in dev/strict mode or accidental multiple calls)
  const successToastShownRef = useRef(false)

  useEffect(() => {
    // reset toast guard whenever dialog opens
    if (open) successToastShownRef.current = false
  }, [open])

  useEffect(() => {
    const loadExperienceData = async () => {
      if (open && experience) {
        setLoading(true)
        try {
          const data: any = await getResumeDataById('experience', experience.id)
          const experienceData = data?.experience || experience

          // Format dates for input fields
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
          // Fallback to the passed experience prop with formatted dates
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

  const handleFormSubmit = async (formData: Partial<Experience>) => {
    setLoading(true)
    try {
      const isEdit = Boolean(experience?.id)
      const data = await saveResumeData(
        formData,
        'experience',
        isEdit ? experience!.id : undefined
      )

      // TODO
      // let resultExperience: Experience

      // if (saved.experiences && Array.isArray(saved.experiences)) {
      //   if (isEdit) {
      //     resultExperience = saved.experiences.find(
      //       (exp) => exp.id === experience!.id
      //     )!
      //   } else {
      //     resultExperience =
      //       saved.experiences.find(
      //         (exp) =>
      //           exp.organization === formData.organization &&
      //           exp.position === formData.position
      //       ) || saved.experiences[saved.experiences.length - 1]
      //   }
      // } else {
      //   resultExperience = {
      //     ...formData,
      //     id: formData.id ?? Date.now().toString(),
      //   } as Experience
      // }
      // TODO

      // onExpSubmit({
      //   experiences: [resultExperience],
      //   education,
      //   personalInfo,
      // })

      if (!successToastShownRef.current) {
        toast.success(`Experience ${isEdit ? 'updated' : 'added'} successfully`)
        successToastShownRef.current = true
      }

      onOpenChange(false)
      setResume(data)
    } catch (err: any) {
      console.error('Failed to save experience:', err)
      toast.error('Failed to save experience', {
        description: err?.message || 'An unexpected error occurred',
      })
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
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='experience'>Experience</TabsTrigger>
            <TabsTrigger value='personal'>Personal Info</TabsTrigger>
            <TabsTrigger value='education'>Education</TabsTrigger>
          </TabsList>

          <ExperienceTab
            initialData={initialExperience}
            loading={loading}
            experience={experience}
            onOpenChange={onOpenChange}
            onSubmit={handleFormSubmit}
          />

          <PersonalInfoTab
            personalInfo={personalInfo}
            onOpenChange={onOpenChange}
            // onUpdatePersonal={onUpdatePersonal}
            // setResume={setResume}
          />

          <EducationTab
            education={education}
            onOpenChange={onOpenChange}
            // setResume={setResume}
            // onUpdateEducation={onUpdateEducation}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
