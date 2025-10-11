import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Education } from '@/lib/types'
import { Minus, Plus } from 'lucide-react'
import React from 'react'

interface EducationProps {
  educationData: Education[]
  updateEducation: (index: number, field: keyof Education, value: any) => void
  addEducation: () => void
  removeEducation: (index:number) => void
  onUpdateEducation: (education: Education[]) => void
  onOpenChange: (open: boolean) => void
  // setEducationData?: React.Dispatch<React.SetStateAction<Education[]>>
}

export default function EducationTab({
  educationData,
  updateEducation,
  addEducation,
  removeEducation,
  onUpdateEducation,
  onOpenChange,
}: EducationProps) {
  return (
    <TabsContent value='education' className='space-y-4'>
      {educationData.map((edu, index: number) => (
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
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
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
  )
}
