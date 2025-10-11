// components/resume/dialog/ExperienceTab.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Experience } from '@/lib/types'
import { formatDateForInput } from '@/lib/utils/date'
import React, { useState, useEffect } from 'react'

interface ExperienceTabProps {
  onOpenChange: (open: boolean) => void
  formData: Partial<Experience>
  setFormData: React.Dispatch<React.SetStateAction<Partial<Experience>>>
  loading?: boolean
  experience?: Experience | null
  handleSubmit: (e: React.FormEvent) => void
  resetAll: () => void
}

export default function ExperienceTab({
  onOpenChange,
  formData,
  setFormData,
  loading,
  experience,
  handleSubmit,
  resetAll,
}: ExperienceTabProps) {
  const [responsibilitiesText, setResponsibilitiesText] = useState('')

  // Initialize form data properly
  useEffect(() => {
    if (formData.responsibilities && formData.responsibilities.length > 0) {
      setResponsibilitiesText(formData.responsibilities.join('\n'))
    } else {
      setResponsibilitiesText('')
    }
  }, [formData])

  // Handle form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert text to array
    const responsibilitiesArray = responsibilitiesText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    // Validation
    if (responsibilitiesArray.length < 2) {
      alert('Please add at least 2 bullet points')
      return
    }

    const wordCount = responsibilitiesArray
      .join(' ')
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    if (wordCount < 10) {
      alert(`Please add more details. You have ${wordCount}/10 words.`)
      return
    }

    // Create the complete experience object
    const experienceData: Experience = {
      id: formData.id || Date.now().toString(),
      organization: formData.organization || '',
      position: formData.position || '',
      location: formData.location || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      responsibilities: responsibilitiesArray,
    }

    // Update parent form data
    setFormData(experienceData)

    // Call the submit handler
    handleSubmit(e)
  }

  // Handle individual field changes
  const handleFieldChange = (field: keyof Experience, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Calculate stats for display
  const bulletPointCount = responsibilitiesText
    .split('\n')
    .filter((line) => line.trim().length > 0).length
  const wordCount = responsibilitiesText
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  return (
    <TabsContent value='experience' className='space-y-4'>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='organization'>Organization *</Label>
            <Input
              id='organization'
              value={formData.organization || ''}
              onChange={(e) =>
                handleFieldChange('organization', e.target.value)
              }
              required
            />
          </div>
          <div>
            <Label htmlFor='position'>Position Title *</Label>
            <Input
              id='position'
              value={formData.position || ''}
              onChange={(e) => handleFieldChange('position', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor='location'>Location</Label>
          <Input
            id='location'
            value={formData.location || ''}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            placeholder='e.g., New York, NY'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='startDate'>Start Date *</Label>
            <Input
              id='startDate'
              type='date'
              value={
                formData.startDate ? formatDateForInput(formData.startDate) : ''
              }
              onChange={(e) => handleFieldChange('startDate', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='endDate'>End Date (Leave empty for current)</Label>
            <Input
              id='endDate'
              type='date'
              value={
                formData.endDate ? formatDateForInput(formData.endDate) : ''
              }
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor='responsibilities'>Responsibilities *</Label>
          <p className='text-xs text-muted-foreground mb-2'>
            • Each line becomes a bullet point
            <br />
            • Minimum 2 bullet points required
            <br />• Minimum 10 words total
          </p>

          <Textarea
            id='responsibilities'
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
            placeholder={`Managed social media accounts with 10K+ followers
Created and scheduled content calendar for multiple platforms  
Analyzed engagement metrics and prepared monthly reports
Collaborated with marketing team on campaign strategies`}
            className='min-h-[140px] text-sm leading-relaxed resize-y'
          />

          <div className='flex justify-between items-center mt-2'>
            <div className='space-y-1'>
              <p
                className={`text-xs ${
                  bulletPointCount >= 2 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                • {bulletPointCount}/2 bullet points
              </p>
              <p
                className={`text-xs ${
                  wordCount >= 10 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                • {wordCount}/10 words
              </p>
            </div>

            {bulletPointCount < 2 || wordCount < 10 ? (
              <p className='text-red-500 text-xs text-right'>
                Please meet the requirements above
              </p>
            ) : (
              <p className='text-green-600 text-xs text-right'>
                ✓ Requirements met
              </p>
            )}
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              onOpenChange(false)
              resetAll()
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={
              loading ||
              !formData.organization ||
              !formData.position ||
              !formData.startDate
            }
          >
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
