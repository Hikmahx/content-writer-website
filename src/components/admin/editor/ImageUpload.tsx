'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Upload, X } from 'lucide-react'

interface ImageUploadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageInsert: (url: string) => void
  editor: any
}

export default function ImageUpload({
  open,
  onOpenChange,
  onImageInsert,
  editor,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<{
    url: string
    publicId: string
  } | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadedImage({ url: data.secure_url, publicId: data.public_id })
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleInsert = () => {
    if (uploadedImage && editor) {
      editor.chain().focus().setImage({ src: uploadedImage.url }).run()
      onImageInsert(uploadedImage.url)
      onOpenChange(false)
      setUploadedImage(null)
    }
  }

  const handleDelete = async () => {
    if (uploadedImage?.publicId) {
      try {
        await fetch(`/api/upload?publicId=${uploadedImage.publicId}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
    setUploadedImage(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {!uploadedImage ? (
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
              <Input
                type='file'
                id='image-upload'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
              />
              <Label htmlFor='image-upload' className='cursor-pointer'>
                <div className='flex flex-col items-center justify-center space-y-2'>
                  <Upload className='h-8 w-8 text-gray-400' />
                  <span className='text-sm text-gray-500'>
                    {uploading ? 'Uploading...' : 'Click to upload an image'}
                  </span>
                </div>
              </Label>
            </div>
          ) : (
            <div className='relative'>
              <img
                src={uploadedImage.url}
                alt='Uploaded'
                className='w-full h-48 object-cover rounded-lg'
              />
              <Button
                variant='destructive'
                size='icon'
                className='absolute top-2 right-2 h-6 w-6'
                onClick={handleDelete}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          )}
          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              onClick={() => {
                onOpenChange(false)
                setUploadedImage(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInsert}
              disabled={!uploadedImage || uploading}
            >
              Insert Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
