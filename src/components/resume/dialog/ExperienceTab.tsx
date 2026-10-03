'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Experience } from '@/lib/types'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { experienceSchema } from '@/lib/validation'
import { z } from 'zod'
import DeleteModal from '@/components/global/DeleteModal'
import { formatDateForInput } from '@/lib/utils/date'

interface ExperienceTabProps {
  experiences: Experience[]
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Experience[]) => void
  onDeleteExperience?: (id: string) => Promise<void>
}

// Same per-entry rules as the single-entity form, plus an id field so saved
// entries can be told apart from new ones (mirrors EducationTab's approach).
const experienceEntrySchema = experienceSchema.extend({ id: z.string() })

const experienceFormSchema = z.object({
  experiences: z
    .array(experienceEntrySchema)
    .min(1, 'At least one experience entry is required'),
})

type ExperienceFormValues = z.infer<typeof experienceFormSchema>

const EMPTY_ENTRY = {
  id: '',
  organization: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  responsibilities: [''],
}

function toFormEntry(exp: Experience) {
  return {
    id: exp.id || '',
    organization: exp.organization || '',
    position: exp.position || '',
    location: exp.location || '',
    startDate: exp.startDate ? formatDateForInput(exp.startDate) : '',
    endDate: exp.endDate ? formatDateForInput(exp.endDate) : '',
    responsibilities: exp.responsibilities?.length
      ? exp.responsibilities
      : [''],
  }
}

export default function ExperienceTab({
  experiences,
  loading,
  onOpenChange,
  onSubmit,
  onDeleteExperience,
}: ExperienceTabProps) {
  const [experienceToDelete, setExperienceToDelete] = useState<{
    id: string
    organization: string
  } | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [responsibilitiesTexts, setResponsibilitiesTexts] = useState<
    string[]
  >([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    setValue,
    trigger,
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      experiences:
        experiences.length > 0 ? experiences.map(toFormEntry) : [EMPTY_ENTRY],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  })

  const watchedExperiences = watch('experiences')

  // Keep the form in sync if the underlying experiences list changes, e.g.
  // after a save elsewhere refreshes the resume while this dialog is open.
  useEffect(() => {
    const entries =
      experiences.length > 0 ? experiences.map(toFormEntry) : [EMPTY_ENTRY]
    reset({ experiences: entries })
    setResponsibilitiesTexts(entries.map((e) => e.responsibilities.join('\n')))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiences])

  const handleResponsibilitiesChange = (index: number, text: string) => {
    setResponsibilitiesTexts((prev) => {
      const next = [...prev]
      next[index] = text
      return next
    })

    const responsibilitiesArray = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    setValue(
      `experiences.${index}.responsibilities`,
      responsibilitiesArray.length > 0 ? responsibilitiesArray : ['']
    )
    trigger(`experiences.${index}.responsibilities`)
  }

  const onFormSubmit = (data: ExperienceFormValues) => {
    const experiencesData: Experience[] = data.experiences.map((exp, i) => {
      const responsibilities = (responsibilitiesTexts[i] || '')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      const cleaned: Experience = {
        organization: exp.organization,
        position: exp.position,
        location: exp.location || '',
        startDate: exp.startDate,
        endDate: exp.endDate || undefined,
        responsibilities,
      }

      if (exp.id && exp.id.trim() !== '') {
        cleaned.id = exp.id
      }

      return cleaned
    })

    onSubmit(experiencesData)
  }

  const handleAddExperience = () => {
    append(EMPTY_ENTRY)
    setResponsibilitiesTexts((prev) => [...prev, ''])
  }

  const handleRemoveExperience = (index: number) => {
    const entry = watchedExperiences[index]

    // Remove outright if it's a new (unsaved) entry
    if (!entry?.id || entry.id.trim() === '') {
      remove(index)
      setResponsibilitiesTexts((prev) => prev.filter((_, i) => i !== index))
      return
    }

    // If it's an existing experience, set up for deletion
    setExperienceToDelete({ id: entry.id, organization: entry.organization })
    setDeleteIndex(index)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (!experienceToDelete || deleteIndex === null || !onDeleteExperience)
      return

    try {
      await onDeleteExperience(experienceToDelete.id)
      remove(deleteIndex)
      setResponsibilitiesTexts((prev) =>
        prev.filter((_, i) => i !== deleteIndex)
      )
    } catch (error) {
      console.error('Failed to delete experience:', error)
      throw error
    } finally {
      setExperienceToDelete(null)
      setDeleteIndex(null)
    }
  }

  return (
    <TabsContent value='experience' className='space-y-4'>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} className='border rounded-lg p-4 space-y-4 mb-4'>
            <div className='flex justify-between items-center'>
              <h4 className='font-medium'>
                Experience {index + 1}
                {watchedExperiences[index]?.id && (
                  <span className='text-xs text-muted-foreground ml-2'>
                    (Saved)
                  </span>
                )}
              </h4>
              {fields.length > 1 && (
                <div className='flex gap-2'>
                  {watchedExperiences[index]?.id && onDeleteExperience ? (
                    <DeleteModal
                      itemName={`experience at ${watchedExperiences[index].organization}`}
                      onDelete={handleConfirmDelete}
                      trigger={
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          disabled={loading}
                          onClick={() => handleRemoveExperience(index)}
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
                      onClick={() => handleRemoveExperience(index)}
                      disabled={loading}
                    >
                      <Minus className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Hidden input for ID */}
            <input type='hidden' {...register(`experiences.${index}.id`)} />

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Organization *</Label>
                <Input
                  {...register(`experiences.${index}.organization`)}
                  className={
                    errors.experiences?.[index]?.organization
                      ? 'border-red-500'
                      : ''
                  }
                  disabled={loading}
                />
                {errors.experiences?.[index]?.organization && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.experiences[index]?.organization?.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Position Title *</Label>
                <Input
                  {...register(`experiences.${index}.position`)}
                  className={
                    errors.experiences?.[index]?.position
                      ? 'border-red-500'
                      : ''
                  }
                  disabled={loading}
                />
                {errors.experiences?.[index]?.position && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.experiences[index]?.position?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                {...register(`experiences.${index}.location`)}
                placeholder='e.g., New York, NY'
                disabled={loading}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Start Date *</Label>
                <Input
                  type='date'
                  {...register(`experiences.${index}.startDate`)}
                  className={
                    errors.experiences?.[index]?.startDate
                      ? 'border-red-500'
                      : ''
                  }
                  disabled={loading}
                />
                {errors.experiences?.[index]?.startDate && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.experiences[index]?.startDate?.message}
                  </p>
                )}
              </div>
              <div>
                <Label>End Date (Leave empty for current)</Label>
                <Input
                  type='date'
                  {...register(`experiences.${index}.endDate`)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label>Responsibilities *</Label>
              <Textarea
                value={responsibilitiesTexts[index] || ''}
                onChange={(e) =>
                  handleResponsibilitiesChange(index, e.target.value)
                }
                placeholder={`Managed social media accounts with 10K+ followers\nCreated and scheduled content calendar for multiple platforms\nAnalyzed engagement metrics and prepared monthly reports`}
                className={`min-h-[140px] text-sm leading-relaxed resize-y ${
                  errors.experiences?.[index]?.responsibilities
                    ? 'border-red-500'
                    : ''
                }`}
                disabled={loading}
              />
              {errors.experiences?.[index]?.responsibilities && (
                <p className='text-red-500 text-xs mt-1 text-right'>
                  {errors.experiences[index]?.responsibilities
                    ?.message as string}
                </p>
              )}
            </div>
          </div>
        ))}

        <Button
          type='button'
          variant='outline'
          onClick={handleAddExperience}
          className='w-full bg-transparent mb-4'
          disabled={loading}
        >
          <Plus className='w-4 h-4 mr-2' />
          Add Experience
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
            {loading ? 'Saving...' : 'Save Experience'}
          </Button>
        </div>
      </form>
    </TabsContent>
  )
}
