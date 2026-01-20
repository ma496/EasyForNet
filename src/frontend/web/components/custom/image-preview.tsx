'use client'

import React, { useEffect, useState } from 'react'
import { useFileGetQuery } from '@/store/api/file-management/files/files-api'
import { cn } from '@/lib/utils'

interface ImagePreviewProps {
  imageName: string
  alt?: string
  className?: string
  fallback?: React.ReactNode
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export const ImagePreview = ({
  imageName,
  alt = 'Image Preview',
  className,
  fallback,
  objectFit = 'contain',
}: ImagePreviewProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>()

  const { data: blob, isSuccess } = useFileGetQuery(
    { fileName: imageName, ignoreStatuses: [404] },
    { skip: !imageName }
  )

  useEffect(() => {
    let url: string | undefined
    if (isSuccess && blob) {
      url = URL.createObjectURL(blob as Blob)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrl(url)
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [blob, isSuccess, imageName])

  if (!isSuccess && !imageUrl) {
    return <>{fallback}</>
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn('h-full w-full', className)}
      style={{ objectFit }}
    />
  )
}

ImagePreview.displayName = 'ImagePreview'
