'use client'

import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  Experience,
  Education,
  PersonalInfo,
  ParsedResumeResponse,
  Resume,
} from '@/lib/types'
import { saveResumeData, deleteResumeData, replaceResumeData } from '@/lib/resume'
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
  // Uploaded-resume data that pre-fills the forms (not yet saved)
  draft: Partial<ParsedResumeResponse> | null
  setDraft: React.Dispatch<
    React.SetStateAction<Partial<ParsedResumeResponse> | null>
  >
}

export function ResumeDialog({
  open,
  onOpenChange,
  onExpSubmit,
  experiences,
  personalInfo,
  education,
  setResume,
  draft,
  setDraft,
}: ResumeDialogProps) {
  const [loading, setLoading] = useState(false)

  // Forms show the uploaded data when there is a draft, otherwise saved data.
  // Draft entries have no id, so saving them replaces what's in the database.
  const draftExperiences = draft?.experience
  const draftEducation = draft?.education
  const formExperiences = draftExperiences ?? experiences
  const formEducation = draftEducation ?? education
  const formPersonalInfo: PersonalInfo = draft?.personalInfo
    ? {
        ...personalInfo,
        // Only overwrite fields the parse found, keep the saved id
        ...(Object.fromEntries(
          Object.entries(draft!.personalInfo!).filter(([, v]) => !!v)
        ) as Partial<PersonalInfo>),
      }
    : personalInfo
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

        const isImport =
          type === 'experience' ? Boolean(draftExperiences) : Boolean(draftEducation)

        if (isImport) {
          // Uploaded resume: replace all saved entries of this type at once
          data = await replaceResumeData(type, entries)
          setDraft((prev) =>
            prev
              ? {
                  ...prev,
                  [type === 'experience' ? 'experience' : 'education']:
                    undefined,
                }
              : prev
          )
        } else {
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
        }

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

        setDraft((prev) => (prev ? { ...prev, personalInfo: undefined } : prev))

        if (!successToastShownRef.current) {
          toast.success(`Personal info ${isEdit ? 'updated' : 'added'} successfully`)
          successToastShownRef.current = true
        }
      }

      setResume(data)
      // Keep the dialog open while other uploaded tabs still await review
      const stillPending =
        (type !== 'experience' && draftExperiences) ||
        (type !== 'education' && draftEducation) ||
        (type !== 'personalInfo' && draft?.personalInfo)
      if (!(draft && stillPending)) onOpenChange(false)
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
      <DialogContent className='max-w-4xl h-[500px] max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden'>
        <DialogHeader className='px-6 pt-6 pb-2 shrink-0'>
          <DialogTitle>Manage Resume</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue='experience'
          className='flex-1 flex flex-col overflow-hidden min-h-0'
        >
          <TabsList className='shrink-0 w-full p-0 bg-background justify-start border-b rounded-none px-6'>
            <TabsTrigger value='experience' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>
              Experience ({formExperiences.length})
            </TabsTrigger>
            <TabsTrigger value='personal' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>
              Personal Info
            </TabsTrigger>
            <TabsTrigger value='education' className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'>
              Education ({formEducation.length})
            </TabsTrigger>
          </TabsList>

          <ExperienceTab
            experiences={formExperiences}
            loading={loading}
            onOpenChange={onOpenChange}
            onSubmit={(formData) => handleFormSubmit('experience', formData)}
            onDeleteExperience={handleDeleteExperience}
          />

          <PersonalInfoTab
            personalInfo={formPersonalInfo}
            loading={loading}
            onOpenChange={onOpenChange}
            onSubmit={(formData) => handleFormSubmit('personalInfo', formData)}
          />

          <EducationTab
            education={formEducation}
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
