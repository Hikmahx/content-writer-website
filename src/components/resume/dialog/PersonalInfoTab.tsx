import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { PersonalInfo } from '@/lib/types'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInfoSchema, PersonalInfoFormData } from '@/lib/validation'

interface PersonalInfoProps {
  personalInfo: PersonalInfo
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<PersonalInfo>) => void
}

export default function PersonalInfoTab({
  personalInfo,
  loading,
  onOpenChange,
  onSubmit,
}: PersonalInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: personalInfo?.firstName || '',
      lastName: personalInfo?.lastName || '',
      email: personalInfo?.email || '',
      linkedin: personalInfo?.linkedin || '',
      address: personalInfo?.address || '',
    },
    mode: 'onChange',
  })

  const onFormSubmit = (data: PersonalInfoFormData) => {
    const personalInfoData: PersonalInfo = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      linkedin: data.linkedin || '',
      address: data.address || undefined,
    }

    if (personalInfo?.id) {
      personalInfoData.id = personalInfo.id
    }

    console.log(personalInfoData)
    onSubmit(personalInfoData)
  }

  return (
    <TabsContent value='personal' className='space-y-4'>
      <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='firstName'>First Name *</Label>
            <Input
              id='firstName'
              {...register('firstName')}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='lastName'>Last Name *</Label>
            <Input
              id='lastName'
              {...register('lastName')}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor='email'>Email *</Label>
          <Input
            id='email'
            type='email'
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor='linkedin'>LinkedIn URL</Label>
          <Input
            id='linkedin'
            {...register('linkedin')}
            placeholder='https://linkedin.com/in/yourprofile'
            className={errors.linkedin ? 'border-red-500' : ''}
          />
          {errors.linkedin && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.linkedin.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor='address'>Address</Label>
          <Input
            id='address'
            {...register('address')}
            placeholder='City, State, Country'
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
          <Button type='submit' disabled={loading}>
            {loading
              ? 'Saving...'
              : personalInfo
              ? 'Update Info'
              : 'Save Info'}
          </Button>
        </div>
      </form>
    </TabsContent>
  )
}
