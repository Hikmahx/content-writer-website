'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ExperienceTimeline } from '@/components/resume/ExperienceTimeline'
import { AddExperienceDialog } from '@/components/resume/AddExperienceDialog'
import { ResumeGenerator } from '@/components/resume/ResumeGenerator'
import { experienceData, educationData, personalInfo } from '@/lib/data'
import type { Experience, Education, PersonalInfo } from '@/lib/types'

const isAdmin = false

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>(experienceData)
  const [education, setEducation] = useState<Education[]>(educationData)
  const [personal, setPersonal] = useState<PersonalInfo>(personalInfo)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  )
  const [activeYear, setActiveYear] = useState<string>('')

  const handleAddExperience = (newExperience: Experience) => {
    if (editingExperience) {
      setExperiences((prev) =>
        prev.map((exp) =>
          exp.id === editingExperience.id ? newExperience : exp
        )
      )
    } else {
      setExperiences((prev) => [
        ...prev,
        { ...newExperience, id: Date.now().toString() },
      ])
    }
    setIsDialogOpen(false)
    setEditingExperience(null)
  }

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience)
    setIsDialogOpen(true)
  }

  const handleDeleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id))
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-6xl mx-auto px-8 py-16'>
        <div className='text-center print:hidden'>
          <h1 className='text-5xl font-serif text-black mb-8'>Experiences</h1>
          <p className='text-gray-600 max-w-2xl mx-auto text-base leading-relaxed'>
            My experiences highlight the stories I’ve crafted and the voices
            I’ve shaped. Each role has strengthened my ability to connect with
            readers.
          </p>
        </div>

        <ExperienceTimeline
          experiences={experiences}
          education={education}
          onEditExperience={isAdmin ? handleEditExperience : undefined}
          onDeleteExperience={isAdmin ? handleDeleteExperience : undefined}
          onActiveYearChange={setActiveYear}
          isAdmin={isAdmin}
        />

        <div className='fixed bottom-8 right-8 z-50'>
          <div className='flex items-center gap-3'>
            {isAdmin && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className='bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md print:hidden'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Experience
              </Button>
            )}
            <ResumeGenerator
              experiences={experiences}
              education={education}
              personalInfo={personal}
            />
          </div>
        </div>

        <AddExperienceDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddExperience}
          experience={editingExperience}
          personalInfo={personal}
          education={education}
          onUpdatePersonal={setPersonal}
          onUpdateEducation={setEducation}
        />
      </div>
    </div>
  )
}
