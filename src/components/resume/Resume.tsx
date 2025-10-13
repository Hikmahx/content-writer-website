'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ExperienceTimeline } from '@/components/resume/ExperienceDisplay/ExperienceTimeline'
import { ResumeDialog } from '@/components/resume/ResumeDialog'
import { ResumeGenerator } from '@/components/resume/ResumeGenerator'
import type { Education, Experience, PersonalInfo, Resume } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { fetchResumeData } from '@/lib/resume'

export default function ResumeInfo() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const [resume, setResume] = useState<Resume>({
    experiences: [],
    education: [],
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      linkedin: '',
      address: '',
    },
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  )
  const [activeYear, setActiveYear] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(
    () => {
      const loadData = async () => {
        try {
          const data = await fetchResumeData()
          setResume({
            experiences: data.experiences || [],
            education: data.education || [],
            personalInfo: data.personalInfo || {},
          })
        } catch (err) {
          console.error('Failed to load resume data:', err)
        } finally {
          setLoading(false)
        }
      }

      loadData()
    },
    [
      // resume
    ]
  )

  const handleAddExperience = (updatedResume: {
    experiences: Experience[]
    education: Education[]
    personalInfo: PersonalInfo
  }) => {
    // setResume({
    //   experiences: updatedResume.experiences || [],
    //   education: updatedResume.education || [],
    //   personalInfo: updatedResume.personalInfo || personalInfo,
    // })

    setIsDialogOpen(false)
    setEditingExperience(null)
  }

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp)
    setIsDialogOpen(true)
  }

  // const handleDeleteExperience = (id: string) =>
  //   setResume((prev) => ({
  //     ...prev,
  //     experiences: prev.experiences.filter((exp) => exp.id !== id),
  //   }))

  // const handleUpdatePersonalInfo = (info: PersonalInfo) =>
  //   setResume((prev) => ({ ...prev, personalInfo: info }))

  // const handleUpdateEducation = (education: Education[]) =>
  //   setResume((prev) => ({ ...prev, education }))

  //   if (loading) {
  //     return (
  //       <div className='min-h-screen flex items-center justify-center'>
  //         <p>Loading...</p>
  //       </div>
  //     )
  //   }

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-6xl mx-auto px-8 py-16'>
        <div className='text-center print:hidden'>
          <h1 className='text-5xl font-serif text-black mb-8'>Experiences</h1>
          <p className='text-gray-600 max-w-2xl mx-auto text-base leading-relaxed'>
            My experiences highlight the stories I've crafted and the voices
            I've shaped. Each role has strengthened my ability to connect with
            readers.
          </p>
        </div>

        <ExperienceTimeline
          experiences={resume.experiences}
          education={resume.education}
          onEditExperience={isAdmin ? handleEditExperience : undefined}
          //   onDeleteExperience={isAdmin ? handleDeleteExperience : undefined}
          onActiveYearChange={setActiveYear}
          isAdmin={isAdmin}
          setResume={setResume}
        />

        <div className='fixed bottom-8 right-8 z-50 flex items-center gap-3'>
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
            experiences={resume.experiences}
            education={resume.education}
            personalInfo={resume.personalInfo}
          />
        </div>

        <ResumeDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) setEditingExperience(null)
          }}
          onExpSubmit={handleAddExperience}
          experience={editingExperience}
          //   setResumeData={setResume}
          personalInfo={resume.personalInfo}
          education={resume.education}
          setResume={setResume}

          //   onUpdatePersonal={handleUpdatePersonalInfo}
          //   onUpdateEducation={handleUpdateEducation}
        />
      </div>
    </div>
  )
}
