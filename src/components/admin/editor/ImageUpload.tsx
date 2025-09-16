'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Link, Image as ImageIcon } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/post'
import { toast } from 'sonner'

interface ImageUploadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageInsert: (url: string) => void
  editor: any
}

type UploadMode = 'file' | 'url'

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
  const [imageUrl, setImageUrl] = useState('')
  const [mode, setMode] = useState<UploadMode>('file')

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const result = await uploadImageToCloudinary(file)
      setUploadedImage({ url: result.url, publicId: result.publicId })
    } catch (error) {
      toast.message('Upload error', {
        description:
          typeof error === 'object' && error && 'message' in error
            ? (error as { message: string }).message
            : 'An error occurred',
      })
    } finally {
      setUploading(false)
    }
  }

  // react-dropzone
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (mode !== 'file' || !acceptedFiles.length) return
      await handleFileUpload(acceptedFiles[0])
    },
    [mode]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  const handleUrlInsert = () => {
    const url = imageUrl.trim()
    if (!url) return

    // Validate URL
    try {
      new URL(url)
    } catch {
      toast('Not a valid image url')
      return
    }

    // Check if it looks like an image
    if (!url.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i)) {
      toast('Not a valid image url')

      return
    }

    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
      onImageInsert(url)
      onOpenChange(false)
      setImageUrl('')
    }
  }

  const handleInsert = () => {
    if (mode === 'file' && uploadedImage && editor) {
      editor.chain().focus().setImage({ src: uploadedImage.url }).run()
      onImageInsert(uploadedImage.url)
      onOpenChange(false)
      setUploadedImage(null)
    } else if (mode === 'url' && imageUrl.trim()) {
      handleUrlInsert()
    }
  }

  const handleDelete = async () => {
    if (uploadedImage?.publicId) {
      try {
        await deleteImageFromCloudinary(uploadedImage.publicId)
      } catch (error) {
        toast.message('Failed to delete image.', {
          description:
            typeof error === 'object' && error && 'message' in error
              ? (error as { message: string }).message
              : 'An error occurred',
        })
      }
    }
    setUploadedImage(null)
  }

  const handleClose = async () => {
    if (uploadedImage?.publicId) {
      try {
        await deleteImageFromCloudinary(uploadedImage.publicId)
      } catch (error) {
        toast.message('Error cleaning up image on cancel', {
          description:
            typeof error === 'object' && error && 'message' in error
              ? (error as { message: string }).message
              : 'An error occurred',
        })
      }
    }
    setUploadedImage(null)
    setImageUrl('')
    setMode('file')
    onOpenChange(false)
  }

  const isInsertDisabled = () => {
    if (mode === 'file') {
      return !uploadedImage || uploading
    } else {
      return !imageUrl.trim()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className='flex border rounded-md p-1 mb-4'>
          <Button
            type='button'
            variant={mode === 'file' ? 'default' : 'ghost'}
            className='flex-1 flex items-center gap-2'
            onClick={() => setMode('file')}
            size='sm'
          >
            <Upload className='h-4 w-4' />
            Upload
          </Button>
          <Button
            type='button'
            variant={mode === 'url' ? 'default' : 'ghost'}
            className='flex-1 flex items-center gap-2'
            onClick={() => setMode('url')}
            size='sm'
          >
            <Link className='h-4 w-4' />
            URL
          </Button>
        </div>

        <div className='space-y-4'>
          {mode === 'file' ? (
            /* File Upload Section */
            !uploadedImage ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className='flex flex-col items-center justify-center space-y-2'>
                  {isDragActive ? (
                    <ImageIcon className='h-8 w-8 text-primary' />
                  ) : (
                    <Upload className='h-8 w-8 text-gray-400' />
                  )}
                  <span className='text-sm text-gray-500'>
                    {uploading
                      ? 'Uploading...'
                      : isDragActive
                      ? 'Drop image here'
                      : 'Drag & drop or click to upload'}
                  </span>
                  <span className='text-xs text-gray-400'>
                    Supports JPEG, PNG, WebP
                  </span>
                </div>
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
            )
          ) : (
            /* URL Input Section */
            <div className='space-y-2'>
              <Label htmlFor='image-url'>Image URL</Label>
              <Input
                id='image-url'
                type='url'
                placeholder='https://example.com/image.jpg'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className='w-full'
              />
              <p className='text-xs text-gray-500'>
                Enter a direct image URL from Unsplash, Imgur, etc.
              </p>
            </div>
          )}

          <div className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleInsert} disabled={isInsertDisabled()}>
              Insert Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
