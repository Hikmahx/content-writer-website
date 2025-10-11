'use client'

import { getResumeDataById, saveResumeData } from '@/lib/resume'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Experience, Education, PersonalInfo } from '@/lib/types'
import { toast } from 'sonner'
import EducationTab from './dialog/EducationTab'
import PersonalInfoTab from './dialog/PersonalInfoTab'
import ExperienceTab from './dialog/ExperienceTab'
import { formatDateForInput } from '@/lib/utils/date'

interface ResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (experience: Experience) => void
  experience?: Experience | null
  personalInfo: PersonalInfo
  education: Education[]
  onUpdatePersonal: (info: PersonalInfo) => void
  onUpdateEducation: (education: Education[]) => void
}

export function ResumeDialog({
  open,
  onOpenChange,
  onSubmit,
  experience,
  personalInfo,
  education,
  onUpdatePersonal,
  onUpdateEducation,
}: ResumeDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Experience>>({
    organization: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    responsibilities: [''],
  })

  const [personalData, setPersonalData] = useState<PersonalInfo>(personalInfo)
  const [educationData, setEducationData] = useState<Education[]>(education)

  // Reset all form states
  const resetAll = () => {
    setFormData({
      organization: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      responsibilities: [''],
    })
    setPersonalData(personalInfo)
    setEducationData(education)
  }

  // Load experience data for editing
  useEffect(() => {
    const loadExperienceData = async () => {
      if (open && experience) {
        setLoading(true)
        try {
          const data: any = await getResumeDataById('experience', experience.id)
          const experienceData = data?.experience || experience

          // Format dates for input fields
          setFormData({
            ...experienceData,
            startDate: experienceData.startDate
              ? formatDateForInput(experienceData.startDate)
              : '',
            endDate: experienceData.endDate
              ? formatDateForInput(experienceData.endDate)
              : '',
          })
        } catch (error) {
          console.error('Failed to load experience:', error)
          // Fallback to the passed experience prop with formatted dates
          setFormData({
            ...experience,
            startDate: experience.startDate
              ? formatDateForInput(experience.startDate)
              : '',
            endDate: experience.endDate
              ? formatDateForInput(experience.endDate)
              : '',
          })
        } finally {
          setLoading(false)
        }
      } else if (open) {
        // Reset for new experience
        resetAll()
      }
    }

    loadExperienceData()
  }, [open, experience])

  useEffect(() => {
    setPersonalData(personalInfo)
  }, [personalInfo])

  useEffect(() => {
    setEducationData(education)
  }, [education])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.organization || !formData.position || !formData.startDate) {
      toast.error('Please fill in all required fields')
      return
    }

    // Use the current counts from the form data
    const currentResponsibilities = formData.responsibilities || []
    if (currentResponsibilities.length < 2) {
      toast.error('Please add at least 2 responsibility bullet points')
      return
    }

    const wordCount = currentResponsibilities
      .join(' ')
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    if (wordCount < 10) {
      toast.error(`Please add more details. You have ${wordCount}/10 words.`)
      return
    }

    setLoading(true)
    try {
      const payload: any = {
        organization: formData.organization,
        position: formData.position,
        location: formData.location || '',
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        responsibilities: currentResponsibilities.filter((r) => r.trim()),
      }

      const isEdit = Boolean(experience?.id)

      const saved = await saveResumeData(
        payload,
        'experience',
        isEdit ? experience!.id : undefined
      )

      // Get the saved experience from response
      let result
      if (saved.experiences && Array.isArray(saved.experiences)) {
        if (isEdit) {
          result = saved.experiences.find((exp) => exp.id === experience!.id)
        } else {
          result = saved.experiences[saved.experiences.length - 1]
        }
      } else if (saved.experiences) {
        result = saved.experiences
      } else {
        result = payload
      }

      if (result) {
        const finalExperience: Experience = {
          ...result,
          id: result.id || (isEdit ? experience!.id : Date.now().toString()),
          responsibilities: currentResponsibilities, // Use the current responsibilities
        }

        // This should immediately update the parent state
        onSubmit(finalExperience)
      }
    } catch (err: any) {
      console.error('Failed to save experience:', err)
      toast.error('Failed to save experience', {
        description: err.message || 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      major: '',
      gpa: '',
      location: '',
      graduationDate: '',
    }
    setEducationData((prev) => [...prev, newEducation])
  }

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: any
  ) => {
    setEducationData((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    )
  }

  const removeEducation = (index: number) => {
    setEducationData((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) {
          resetAll()
        }
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
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            experience={experience}
            onOpenChange={onOpenChange}
            handleSubmit={handleSubmit}
            resetAll={resetAll}
          />

          <PersonalInfoTab
            personalData={personalData}
            setPersonalData={setPersonalData}
            onOpenChange={onOpenChange}
            onUpdatePersonal={onUpdatePersonal}
          />

          <EducationTab
            educationData={educationData}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            onOpenChange={onOpenChange}
            onUpdateEducation={onUpdateEducation}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
