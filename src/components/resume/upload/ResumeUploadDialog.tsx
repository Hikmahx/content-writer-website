'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sparkles, Upload, Loader2 } from 'lucide-react'
import type { ParsedResumeResponse, Resume } from '@/lib/types'
import { deleteResumeData } from '@/lib/resume'

type Step = 'upload' | 'parsing'

interface ResumeUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resume: Resume
  setResume: React.Dispatch<React.SetStateAction<Resume>>
  // Called once parsed data has been merged into resume state, so the
  // caller can open the regular manage-resume dialog for review.
  onParsed: () => void
}

export function ResumeUploadDialog({
  open,
  onOpenChange,
  resume,
  setResume,
  onParsed,
}: ResumeUploadDialogProps) {
  const [step, setStep] = useState<Step>('upload')

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setStep('upload')
    onOpenChange(nextOpen)
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setStep('parsing')

      try {
        const formData = new FormData()
        formData.append('file', file)

        const resp = await axios.post<ParsedResumeResponse>(
          '/api/resume/parse',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        const parsed = resp.data

        // Uploading a resume is meant to replace what's on file, not add to
        // it - so clear out the existing saved experience/education first.
        try {
          await Promise.all([
            ...resume.experiences
              .filter((exp) => exp.id)
              .map((exp) => deleteResumeData('experience', exp.id as string)),
            ...resume.education
              .filter((edu) => edu.id)
              .map((edu) => deleteResumeData('education', edu.id as string)),
          ])
        } catch (deleteErr) {
          console.error(
            'Failed to clear existing resume data before import:',
            deleteErr
          )
          toast.error("Couldn't replace your existing resume entries", {
            description: 'Please try again in a moment.',
          })
          setStep('upload')
          return
        }

        // Replace local state with just the parsed items (as new, unsaved
        // entries) - no separate review UI. The same Experience/Education/
        // Personal Info tabs used for manual editing already let you
        // review, edit, remove, and save arrays of entries, so we just hand
        // off to them instead of duplicating that UI here.
        setResume((prev) => ({
          experiences: parsed.experience,
          education: parsed.education,
          personalInfo: {
            ...prev.personalInfo,
            // Only overwrite fields the parse actually found something for,
            // so a blank AI miss never clobbers good existing data.
            ...Object.fromEntries(
              Object.entries(parsed.personalInfo).filter(([, v]) => !!v)
            ),
          },
        }))

        toast.success('Resume parsed', {
          description:
            'Your previous experience and education were replaced - review the details in each tab, then save.',
        })

        handleClose(false)
        onParsed()
      } catch (err: any) {
        toast.error('Could not parse resume', {
          description:
            err?.response?.data?.error ||
            'Something went wrong while reading that file.',
        })
        setStep('upload')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resume, onParsed, setResume]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    multiple: false,
  })

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Sparkles className='w-5 h-5' />
            Upload &amp; parse resume
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-black bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className='w-10 h-10 mx-auto mb-4 text-gray-400' />
            <p className='text-sm font-medium text-foreground mb-1'>
              Drop a resume here, or click to browse
            </p>
            <p className='text-xs text-muted-foreground'>
              PDF or DOCX, up to 8MB. We&apos;ll pre-fill your Experience,
              Education, and Personal Info tabs so you can review before
              saving.
            </p>
          </div>
        )}

        {step === 'parsing' && (
          <div className='flex flex-col items-center justify-center py-16 gap-3'>
            <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>
              Reading and parsing your resume...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
