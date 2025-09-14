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
import { Upload } from 'lucide-react'

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
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Create a temporary URL for the file
      const url = URL.createObjectURL(file)
      onImageInsert(url)
      
      // Insert image into editor
      editor?.chain().focus().setImage({ src: url }).run()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      onImageInsert(imageUrl.trim())
      editor?.chain().focus().setImage({ src: imageUrl.trim() }).run()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>
              Upload from device
            </label>
            <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
              <Upload className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
              <p className='text-sm text-muted-foreground mb-2'>
                Drag and drop an image, or click to browse
              </p>
              <input
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
                id='image-upload'
                disabled={uploading}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose file'}
              </Button>
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>
              Or paste image URL
            </label>
            <div className='flex gap-2'>
              <Input
                placeholder='https://example.com/image.jpg'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button onClick={handleUrlInsert} disabled={!imageUrl.trim()}>
                <Upload className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}