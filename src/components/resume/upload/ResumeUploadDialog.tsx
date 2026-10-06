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
import type { ParsedResumeResponse } from '@/lib/types'

type Step = 'upload' | 'parsing'

interface ResumeUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Called with the parsed data so the caller can pre-fill the manage-resume
  // forms. Nothing is saved or deleted until the user clicks Save there.
  onParsed: (parsed: ParsedResumeResponse) => void
}

export function ResumeUploadDialog({
  open,
  onOpenChange,
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

        toast.success('Resume parsed', {
          description:
            'The forms have been filled in - review each tab, then save. Nothing is saved until you do.',
        })

        handleClose(false)
        onParsed(parsed)
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
    [onParsed]
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
