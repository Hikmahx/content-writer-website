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
import { Upload, X } from 'lucide-react'
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/post'

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

    try {
      const result = await uploadImageToCloudinary(file)
      setUploadedImage({ url: result.url, publicId: result.publicId })
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
        await deleteImageFromCloudinary(uploadedImage.publicId)
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
    setUploadedImage(null)
  }

  const handleClose = async () => {
    // Clean up the uploaded image if user cancels
    if (uploadedImage?.publicId) {
      try {
        await deleteImageFromCloudinary(uploadedImage.publicId)
      } catch (error) {
        console.error('Error cleaning up image on cancel:', error)
      }
    }
    setUploadedImage(null)
    onOpenChange(false)
  }

  // Also clean up when the dialog is closed via other means (e.g., clicking outside)
  const handleOpenChange = async (newOpen: boolean) => {
    if (!newOpen && uploadedImage?.publicId) {
      // Dialog is closing and we have an uploaded image - clean it up
      try {
        await deleteImageFromCloudinary(uploadedImage.publicId)
      } catch (error) {
        console.error('Error cleaning up image on dialog close:', error)
      }
      setUploadedImage(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <Button variant='outline' onClick={handleClose}>
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
