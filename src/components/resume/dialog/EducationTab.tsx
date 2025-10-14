'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Education } from '@/lib/types'
import { Minus, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema } from '@/lib/validation'
import { z } from 'zod'
import DeleteModal from '@/components/global/DeleteModal'

interface EducationTabProps {
  education: Education[]
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Education[]) => void
  onDeleteEducation?: (id: string) => Promise<void>
}

const educationFormSchema = z.object({
  education: z
    .array(educationSchema)
    .min(1, 'At least one education entry is required'),
})

type EducationFormValues = z.infer<typeof educationFormSchema>

export default function EducationTab({
  education,
  loading,
  onOpenChange,
  onSubmit,
  onDeleteEducation,
}: EducationTabProps) {
  const [educationToDelete, setEducationToDelete] = useState<{
    id: string
    institution: string
  } | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      education:
        education.length > 0
          ? education.map((edu) => ({
              id: edu.id || '',
              institution: edu.institution || '',
              degree: edu.degree || '',
              major: edu.major || '',
              gpa: edu.gpa || '',
              location: edu.location || '',
              graduationDate: edu.graduationDate || '',
            }))
          : [
              {
                id: '',
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

  const watchedEducation = watch('education')

  const onFormSubmit = (data: EducationFormValues) => {
    //
    const educationData: Education[] = data.education.map((edu) => {
      const cleanedEdu: Education = {
        institution: edu.institution,
        major: edu.major,
        location: edu.location,
        graduationDate: edu.graduationDate,
      }

      // Include id if data already exist in DB
      if (edu.id && edu.id.trim() !== '') {
        cleanedEdu.id = edu.id
      }
      if (edu.degree && edu.degree.trim() !== '') {
        cleanedEdu.degree = edu.degree
      }
      if (edu.gpa && edu.gpa.trim() !== '') {
        cleanedEdu.gpa = edu.gpa
      }

      return cleanedEdu
    })

    onSubmit(educationData)
  }

  const handleAddEducation = () => {
    append({
      id: '',
      institution: '',
      degree: '',
      major: '',
      gpa: '',
      location: '',
      graduationDate: '',
    })
  }

  const handleRemoveEducation = (index: number) => {
    const educationEntry = watchedEducation[index]

    // Remoove id if new entry
    if (!educationEntry.id || educationEntry.id.trim() === '') {
      remove(index)
      return
    }

    // If it's an existing education, set up for deletion
    setEducationToDelete({
      id: educationEntry.id,
      institution: educationEntry.institution,
    })
    setDeleteIndex(index)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (!educationToDelete || deleteIndex === null || !onDeleteEducation) return

    try {
      await onDeleteEducation(educationToDelete.id)
      // Remove from form after successful API deletion
      remove(deleteIndex)
    } catch (error) {
      console.error('Failed to delete education:', error)
      throw error
    } finally {
      setEducationToDelete(null)
      setDeleteIndex(null)
    }
  }

  return (
    <TabsContent value='education' className='space-y-4'>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} className='border rounded-lg p-4 space-y-4 mb-4'>
            <div className='flex justify-between items-center'>
              <h4 className='font-medium'>
                Education {index + 1}
                {watchedEducation[index]?.id && (
                  <span className='text-xs text-muted-foreground ml-2'>
                    (Saved)
                  </span>
                )}
              </h4>
              {fields.length > 1 && (
                <div className='flex gap-2'>
                  {watchedEducation[index]?.id && onDeleteEducation ? (
                    <DeleteModal
                      itemName={`education from ${watchedEducation[index].institution}`}
                      onDelete={handleConfirmDelete}
                      trigger={
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          disabled={loading}
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      }
                    />
                  ) : (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => remove(index)}
                      disabled={loading}
                    >
                      <Minus className='w-4 h-4' />
                    </Button>
                  )}
                </div>
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
                  disabled={loading}
                />
                {errors.education?.[index]?.institution && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.education[index]?.institution?.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Degree</Label>
                <Input
                  {...register(`education.${index}.degree`)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Major *</Label>
                <Input
                  {...register(`education.${index}.major`)}
                  className={
                    errors.education?.[index]?.major ? 'border-red-500' : ''
                  }
                  disabled={loading}
                />
                {errors.education?.[index]?.major && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.education[index]?.major?.message}
                  </p>
                )}
              </div>
              <div>
                <Label>GPA</Label>
                <Input
                  {...register(`education.${index}.gpa`)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Location *</Label>
                <Input
                  {...register(`education.${index}.location`)}
                  className={
                    errors.education?.[index]?.location ? 'border-red-500' : ''
                  }
                  disabled={loading}
                />
                {errors.education?.[index]?.location && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.education[index]?.location?.message}
                  </p>
                )}
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
                  disabled={loading}
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
          disabled={loading}
        >
          <Plus className='w-4 h-4 mr-2' />
          Add Education
        </Button>

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={!isValid || loading}>
            {loading ? 'Saving...' : 'Save Education'}
          </Button>
        </div>
      </form>
    </TabsContent>
  )
}
