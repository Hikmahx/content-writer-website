'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Upload, UserCog } from 'lucide-react'
import { ExperienceTimeline } from '@/components/resume/ExperienceDisplay/ExperienceTimeline'
import { ResumeDialog } from '@/components/resume/ResumeDialog'
import { ResumeUploadDialog } from '@/components/resume/upload/ResumeUploadDialog'
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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
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
  }

  // All experiences are editable inline once the dialog is open (the
  // Experience tab lists every entry), so the pencil icon on a timeline
  // item just needs to open the dialog.
  const handleEditExperience = () => {
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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button className='bg-beige hover:bg-beige/50 text-gray-800 hover:text-black px-4 py-2 rounded-md print:hidden'>
                  <UserCog className='w-4 h-4' />
                  <span className="hidden">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' align='end' className='w-48'>
                <DropdownMenuItem onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className='w-4 h-4 mr-2' />
                  Upload Resume
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  <Plus className='w-4 h-4 mr-2' />
                  Add/Update Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ResumeGenerator
            experiences={resume.experiences}
            education={resume.education}
            personalInfo={resume.personalInfo}
          />
        </div>

        <ResumeUploadDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          resume={resume}
          setResume={setResume}
          onParsed={() => setIsDialogOpen(true)}
        />

        <ResumeDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onExpSubmit={handleAddExperience}
          experiences={resume.experiences}
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
