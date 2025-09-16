'use client'

import { useState } from 'react'
import { uploadImageToCloudinary } from '@/lib/post'

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true)
    try {
      const result = await uploadImageToCloudinary(file)
      return result.url
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return {
    uploadImage,
    isUploading,
    uploadProgress
  }
}