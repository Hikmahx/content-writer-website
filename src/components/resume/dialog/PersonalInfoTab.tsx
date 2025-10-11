import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { PersonalInfo } from '@/lib/types'
import React from 'react'

interface PersonalInfoProps {
  personalData: PersonalInfo
  setPersonalData: React.Dispatch<React.SetStateAction<PersonalInfo>>
  onOpenChange: (open: boolean) => void
  onUpdatePersonal: (personalInfo: PersonalInfo) => void
}
export default function PersonalInfoTab({
  personalData,
  setPersonalData,
  onOpenChange,
  onUpdatePersonal
}:PersonalInfoProps) {
  return (
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
  )
}
