// components/resume/dialog/EducationTab.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Education } from '@/lib/types'
import { Minus, Plus } from 'lucide-react'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema } from '@/lib/validation'
import { z } from 'zod'

interface EducationProps {
  education: Education[]
  onOpenChange: (open: boolean) => void
  // onUpdateEducation: (education: Education[]) => void
}

type EducationFormData = z.infer<typeof educationSchema>

const educationFormSchema = z.object({
  education: z
    .array(educationSchema)
    .min(1, 'At least one education entry is required'),
})

type EducationFormValues = z.infer<typeof educationFormSchema>

export default function EducationTab({
  education,
  onOpenChange,
  // onUpdateEducation,
}: EducationProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      education:
        education.length > 0
          ? education.map((edu) => ({
              ...edu,
              major: edu.major || '',
              gpa: edu.gpa || '',
              location: edu.location || '',
            }))
          : [
              {
                id: Date.now().toString(),
                institution: '',
                degree: '',
                major: '',
                gpa: '',
                location: '',
                graduationDate: '',
              },
            ],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  })

  const onSubmit = (data: EducationFormValues) => {
    const educationData: Education[] = data.education.map((edu) => ({
      ...edu,
      major: edu.major || undefined,
      gpa: edu.gpa || undefined,
      location: edu.location || undefined,
    }))
    // onUpdateEducation(educationData)
    console.log(educationData)
  }

  const handleAddEducation = () => {
    append({
      id: Date.now().toString(),
      institution: '',
      degree: '',
      major: '',
      gpa: '',
      location: '',
      graduationDate: '',
    })
  }

  return (
    <TabsContent value='education' className='space-y-4'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} className='border rounded-lg p-4 space-y-4 mb-4'>
            <div className='flex justify-between items-center'>
              <h4 className='font-medium'>Education {index + 1}</h4>
              {fields.length > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => remove(index)}
                >
                  <Minus className='w-4 h-4' />
                </Button>
              )}
            </div>

            {/* Hidden input for ID */}
            <input type='hidden' {...register(`education.${index}.id`)} />

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Institution *</Label>
                <Input
                  {...register(`education.${index}.institution`)}
                  className={
                    errors.education?.[index]?.institution
                      ? 'border-red-500'
                      : ''
                  }
                />
                {errors.education?.[index]?.institution && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.education[index]?.institution?.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Degree *</Label>
                <Input
                  {...register(`education.${index}.degree`)}
                  className={
                    errors.education?.[index]?.degree ? 'border-red-500' : ''
                  }
                />
                {errors.education?.[index]?.degree && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.education[index]?.degree?.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Major</Label>
                <Input {...register(`education.${index}.major`)} />
              </div>
              <div>
                <Label>GPA</Label>
                <Input {...register(`education.${index}.gpa`)} />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Location</Label>
                <Input {...register(`education.${index}.location`)} />
              </div>
              <div>
                <Label>Graduation Date *</Label>
                <Input
                  type='date'
                  {...register(`education.${index}.graduationDate`)}
                  className={
                    errors.education?.[index]?.graduationDate
                      ? 'border-red-500'
                      : ''
                  }
                />
                {errors.education?.[index]?.graduationDate && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.education[index]?.graduationDate?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <Button
          type='button'
          variant='outline'
          onClick={handleAddEducation}
          className='w-full bg-transparent mb-4'
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
          <Button type='submit' disabled={!isValid}>
            Save Education
          </Button>
        </div>
      </form>
    </TabsContent>
  )
}
