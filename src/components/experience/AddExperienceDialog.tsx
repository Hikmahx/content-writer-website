'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Minus } from 'lucide-react'
import type { Experience, Education, PersonalInfo } from '@/lib/types'

interface AddExperienceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (experience: Experience) => void
  experience?: Experience | null
  personalInfo: PersonalInfo
  education: Education[]
  onUpdatePersonal: (info: PersonalInfo) => void
  onUpdateEducation: (education: Education[]) => void
}

export function AddExperienceDialog({
  open,
  onOpenChange,
  onSubmit,
  experience,
  personalInfo,
  education,
  onUpdatePersonal,
  onUpdateEducation,
}: AddExperienceDialogProps) {
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

  useEffect(() => {
    if (experience) {
      setFormData(experience)
    } else {
      setFormData({
        organization: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        responsibilities: [''],
      })
    }
  }, [experience])

  useEffect(() => {
    setPersonalData(personalInfo)
  }, [personalInfo])

  useEffect(() => {
    setEducationData(education)
  }, [education])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.organization && formData.position && formData.startDate) {
      onSubmit({
        id: experience?.id || Date.now().toString(),
        organization: formData.organization,
        position: formData.position,
        location: formData.location || '',
        startDate: formData.startDate,
        endDate: formData.endDate,
        responsibilities:
          formData.responsibilities?.filter((r) => r.trim()) || [],
      })
    }
  }

  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...(prev.responsibilities || []), ''],
    }))
  }

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities:
        prev.responsibilities?.filter((_, i) => i !== index) || [],
    }))
  }

  const updateResponsibility = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities:
        prev.responsibilities?.map((r, i) => (i === index ? value : r)) || [],
    }))
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

  const handleSaveAll = () => {
    onUpdatePersonal(personalData)
    onUpdateEducation(educationData)
    handleSubmit(new Event('submit') as any)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          <TabsContent value='experience' className='space-y-4'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='organization'>Organization</Label>
                  <Input
                    id='organization'
                    value={formData.organization || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        organization: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='position'>Position Title</Label>
                  <Input
                    id='position'
                    value={formData.position || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  value={formData.location || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='startDate'>Start Date</Label>
                  <Input
                    id='startDate'
                    type='date'
                    value={formData.startDate || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='endDate'>End Date (Optional)</Label>
                  <Input
                    id='endDate'
                    type='date'
                    value={formData.endDate || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Responsibilities</Label>
                {formData.responsibilities?.map((responsibility, index) => (
                  <div key={index} className='flex gap-2 mt-2'>
                    <Textarea
                      value={responsibility}
                      onChange={(e) =>
                        updateResponsibility(index, e.target.value)
                      }
                      placeholder='Describe your responsibility...'
                      className='flex-1'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeResponsibility(index)}
                      disabled={formData.responsibilities?.length === 1}
                    >
                      <Minus className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addResponsibility}
                  className='mt-2 bg-transparent'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Responsibility
                </Button>
              </div>

              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {experience ? 'Update' : 'Add'} Experience
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value='personal' className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  value={personalData.firstName}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  value={personalData.lastName}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={personalData.email}
                onChange={(e) =>
                  setPersonalData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor='linkedin'>LinkedIn URL</Label>
              <Input
                id='linkedin'
                value={personalData.linkedin}
                onChange={(e) =>
                  setPersonalData((prev) => ({
                    ...prev,
                    linkedin: e.target.value,
                  }))
                }
              />
            </div>

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => onUpdatePersonal(personalData)}>
                Save Personal Info
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='education' className='space-y-4'>
            {educationData.map((edu, index) => (
              <div key={edu.id} className='border rounded-lg p-4 space-y-4'>
                <div className='flex justify-between items-center'>
                  <h4 className='font-medium'>Education {index + 1}</h4>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => removeEducation(index)}
                  >
                    <Minus className='w-4 h-4' />
                  </Button>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(index, 'institution', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, 'degree', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Major</Label>
                    <Input
                      value={edu.major || ''}
                      onChange={(e) =>
                        updateEducation(index, 'major', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>GPA</Label>
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) =>
                        updateEducation(index, 'gpa', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={edu.location}
                      onChange={(e) =>
                        updateEducation(index, 'location', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Graduation Date</Label>
                    <Input
                      type='date'
                      value={edu.graduationDate}
                      onChange={(e) =>
                        updateEducation(index, 'graduationDate', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type='button'
              variant='outline'
              onClick={addEducation}
              className='w-full bg-transparent'
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Education
            </Button>

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => onUpdateEducation(educationData)}>
                Save Education
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
