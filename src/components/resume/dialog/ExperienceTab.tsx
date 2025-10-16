import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Experience } from '@/lib/types'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { experienceSchema, ExperienceFormData } from '@/lib/validation'

interface ExperienceTabProps {
  initialData?: Partial<Experience> | null
  loading?: boolean
  experience?: Experience | null
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<Experience>) => void
}

export default function ExperienceTab({
  initialData,
  loading,
  experience,
  onOpenChange,
  onSubmit,
}: ExperienceTabProps) {
  const [responsibilitiesText, setResponsibilitiesText] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      organization: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      responsibilities: [''],
    },
    mode: 'onChange',
  })

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      const formValues = {
        organization: initialData.organization || '',
        position: initialData.position || '',
        location: initialData.location || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        responsibilities: initialData.responsibilities || [''],
      }

      reset(formValues)
      setResponsibilitiesText(formValues.responsibilities.join('\n'))
    }
  }, [initialData, reset])

  // Handle textarea changes
  const handleTextareaChange = (text: string) => {
    setResponsibilitiesText(text)
    const responsibilitiesArray = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    setValue(
      'responsibilities',
      responsibilitiesArray.length > 0 ? responsibilitiesArray : ['']
    )
    trigger('responsibilities')
  }

  // Handle form submission
  const onFormSubmit = (data: ExperienceFormData) => {
    const finalResponsibilities = responsibilitiesText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const experienceData: Partial<Experience> = {
      organization: data.organization,
      position: data.position,
      location: data.location || '',
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      responsibilities: finalResponsibilities,
    }

    if (experience?.id) {
      experienceData.id = experience.id
    }
    // console.log({ experienceData })
    onSubmit(experienceData)
  }

  return (
    <TabsContent value='experience' className='space-y-4'>
      <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='organization'>Organization *</Label>
            <Input
              id='organization'
              {...register('organization')}
              className={errors.organization ? 'border-red-500' : ''}
            />
            {errors.organization && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.organization.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='position'>Position Title *</Label>
            <Input
              id='position'
              {...register('position')}
              className={errors.position ? 'border-red-500' : ''}
            />
            {errors.position && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.position.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor='location'>Location</Label>
          <Input
            id='location'
            {...register('location')}
            placeholder='e.g., New York, NY'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='startDate'>Start Date *</Label>
            <Input
              id='startDate'
              type='date'
              {...register('startDate')}
              className={errors.startDate ? 'border-red-500' : ''}
            />
            {errors.startDate && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='endDate'>End Date (Leave empty for current)</Label>
            <Input id='endDate' type='date' {...register('endDate')} />
          </div>
        </div>

        <div>
          <Label htmlFor='responsibilities'>Responsibilities *</Label>
          <Textarea
            id='responsibilities'
            value={responsibilitiesText}
            onChange={(e) => handleTextareaChange(e.target.value)}
            placeholder={`Managed social media accounts with 10K+ followers\nCreated and scheduled content calendar for multiple platforms\nAnalyzed engagement metrics and prepared monthly reports`}
            className={`min-h-[140px] text-sm leading-relaxed resize-y ${
              errors.responsibilities ? 'border-red-500' : ''
            }`}
          />

          <div className='flex justify-between items-center mt-2'>
            {errors.responsibilities && (
              <p className='text-red-500 text-xs text-right'>
                {errors.responsibilities.message}
              </p>
            )}
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={loading}>
            {loading
              ? 'Saving...'
              : experience
              ? 'Update Experience'
              : 'Add Experience'}
          </Button>
        </div>
      </form>
    </TabsContent>
  )
}
