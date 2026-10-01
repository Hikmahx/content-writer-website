import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { generateObject } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { z } from 'zod'

const PDF_MIME = 'application/pdf'
const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

/**
 * Extracts raw text from an uploaded resume file. Supports PDF and DOCX.
 */
export async function extractResumeText(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const lower = filename.toLowerCase()

  if (mimeType === PDF_MIME || lower.endsWith('.pdf')) {
    const result = await pdfParse(buffer)
    return result.text
  }

  if (mimeType === DOCX_MIME || lower.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  throw new Error(
    'Unsupported file type. Please upload a PDF or DOCX resume.'
  )
}

const experienceSchema = z.object({
  organization: z.string().describe('Company or organization name'),
  position: z.string().describe('Job title'),
  location: z.string().describe('City, state/country, or empty string'),
  startDate: z
    .string()
    .describe(
      'ISO date (YYYY-MM-DD). If only a month/year or year is known, use the 1st of that month/January of that year.'
    ),
  endDate: z
    .string()
    .nullable()
    .describe('ISO date (YYYY-MM-DD), or null if this role is current/ongoing'),
  responsibilities: z
    .array(z.string())
    .describe('Bullet points describing responsibilities or achievements'),
})

const educationSchema = z.object({
  institution: z.string(),
  degree: z.string().nullable().describe('e.g. "Bachelor of Science", or null if unknown'),
  major: z.string(),
  location: z.string().describe('City, state/country, or empty string'),
  gpa: z.string().nullable(),
  graduationDate: z
    .string()
    .describe(
      'ISO date (YYYY-MM-DD). If only a month/year or year is known, use the 1st of that month/January of that year.'
    ),
})

const personalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().describe('Empty string if not found'),
  address: z.string().nullable(),
  linkedin: z.string().nullable().describe('LinkedIn URL if present, else null'),
})

export const parsedResumeSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
})

export type ParsedResume = z.infer<typeof parsedResumeSchema>

/**
 * Sends extracted resume text to Groq and returns structured data matching
 * the site's Experience / Education / PersonalInfo shapes.
 */
export async function parseResumeText(text: string): Promise<ParsedResume> {
  if (!process.env.GROQ_AI_KEY) {
    throw new Error('Groq API key is not configured')
  }

  const groq = createGroq({ apiKey: process.env.GROQ_AI_KEY })
  const model = groq(process.env.GROQ_RESUME_MODEL || 'llama-3.3-70b-versatile')

  const { object } = await generateObject({
    model,
    schema: parsedResumeSchema,
    system:
      'You extract structured resume data from raw, messily-formatted resume text. ' +
      'Only use information present in the text - never invent employers, schools, or dates. ' +
      "If a field genuinely isn't present, use an empty string (or null where the schema allows it, or an empty array for lists).",
    prompt: `Extract the personal info, work experience, and education from this resume text:\n\n${text.slice(
      0,
      15000
    )}`,
  })

  return object
}
