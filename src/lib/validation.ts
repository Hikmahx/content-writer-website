import { z } from 'zod'

export const experienceSchema = z.object({
  organization: z.string().min(1, 'Organization is required'),
  position: z.string().min(1, 'Position title is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  responsibilities: z
    .array(z.string())
    .min(2, 'At least 2 bullet points are required')
    .refine(
      (responsibilities) => {
        const allText = responsibilities.join(' ')
        const wordCount = allText
          .split(/\s+/)
          .filter((word) => word.length > 0).length
        return wordCount >= 10
      },
      { message: 'Responsibilities must have at least 10 words total' }
    ),
})

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  major: z.string().optional(),
  gpa: z.string().optional(),
  location: z.string().optional(),
  graduationDate: z.string().min(1, 'Graduation date is required'),
})

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
})

export type ExperienceFormData = z.infer<typeof experienceSchema>
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type EducationFormData = z.infer<typeof educationSchema>

export const educationArraySchema = z
  .array(educationSchema)
  .min(1, 'At least one education entry is required')
