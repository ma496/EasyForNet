'use client'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { cn, confirmDeleteAlert, errorAlert } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { useFileUploadMutation } from '@/store/api/file-management/files/files-api'
import { FileUploadResponse } from '@/store/api/file-management/files/files-dtos'
import { useFileDeleteMutation } from '@/store/api/file-management/files/files-api'
import { useLazyFileGetQuery } from '@/store/api/file-management/files/files-api'
import { getTranslation } from '@/i18n'

export interface FileUploadProps {
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  rounded?: ButtonProps['rounded']
  label?: string
  name: string
  className?: string
  buttonText?: string
  icon?: React.ReactNode
  showFileName?: boolean
  onUploaded?: (response: FileUploadResponse) => void
  onError?: (error: any) => void
  fileName?: string
  accept?: string
  id?: string
  disabled?: boolean
  forceDelete?: boolean // file delete only when forceDelete is true
  maxSizeBytes?: number
  onClear?: () => void
  validateFile?: (file: File) => string | undefined
  showError?: boolean
  children?: (ctx: {
    open: () => void
    isUploading: boolean
    selectedFileName: string
    selectedFileUrl?: string
    response?: FileUploadResponse
    error?: any
    deleteFile: () => Promise<void>
    isDeleting: boolean
    getFileUrl: () => Promise<string | undefined>
    inputId: string
    accept?: string
  }) => React.ReactNode
}

export const FileUpload = ({
  label,
  name,
  id,
  accept,
  className,
  buttonText = 'Upload',
  icon,
  showFileName = true,
  variant,
  size,
  rounded,
  disabled,
  forceDelete = false,
  onUploaded,
  onError,
  fileName,
  maxSizeBytes,
  onClear,
  validateFile,
  showError = true,
  children,
}: FileUploadProps) => {
  const inputId = id ?? useId()
  const { t } = getTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | undefined>(undefined)
  const [response, setResponse] = useState<FileUploadResponse | undefined>(undefined)
  const [error, setError] = useState<any>(undefined)
  const [uploadFile, { isLoading }] = useFileUploadMutation()
  const [deleteFileTrigger, { isLoading: isDeleting }] = useFileDeleteMutation()
  const [getFileTrigger] = useLazyFileGetQuery()
  const resolvedIcon = useMemo(() => icon ?? <Upload className="h-4 w-4" />, [icon])
  const hasCurrent = useMemo(() => !!selectedFileName || (forceDelete && !!(fileName ?? response?.fileName)), [selectedFileName, forceDelete, fileName, response])

  const isBlobUrl = useCallback((url?: string) => !!url && url.startsWith('blob:'), [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (maxSizeBytes && file.size > maxSizeBytes) {
        const err = new Error('File exceeds size limit')
        if (showError) {
          errorAlert({ text: t('to_large_file') })
        }
        setError(err)
        onError?.(err)
        e.target.value = ''
        return
      }

      if (validateFile) {
        const message = validateFile(file)
        if (message) {
          const err = new Error(message)
          setError(err)
          onError?.(err)
          e.target.value = ''
          return
        }
      }

      if (isBlobUrl(selectedFileUrl)) {
        URL.revokeObjectURL(selectedFileUrl!)
      }
      const res = await uploadFile({ file })
      if (res.data) {
        setSelectedFileName(file.name)
        const url = URL.createObjectURL(file)
        setSelectedFileUrl(url)
        setResponse(res.data)
        setError(undefined)
        onUploaded?.(res.data)
      }
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [uploadFile, onUploaded, onError, selectedFileUrl, maxSizeBytes, validateFile],
  )

  const deleteFile = useCallback(async () => {
    const current = fileName ?? response?.fileName

    if (forceDelete) {
      if (!current) return
      const res = await deleteFileTrigger({ fileName: current })
      if (!res.error) {
        setSelectedFileName('')
        setSelectedFileUrl(undefined)
        setResponse(undefined)
      }
    } else {
      setSelectedFileName('')
      if (isBlobUrl(selectedFileUrl)) {
        URL.revokeObjectURL(selectedFileUrl!)
      }
      setSelectedFileUrl(undefined)
      onClear?.()
    }
  }, [forceDelete, fileName, response, deleteFileTrigger, selectedFileUrl, onClear])

  const getFileUrl = useCallback(async (): Promise<string | undefined> => {
    const current = fileName ?? response?.fileName
    if (!current) return undefined
    const result = await getFileTrigger({ fileName: current })
    if (result.data) {
      return URL.createObjectURL(result.data as Blob)
    }
    return undefined
  }, [fileName, response, getFileTrigger])

  useEffect(() => {
    return () => {
      if (isBlobUrl(selectedFileUrl)) {
        URL.revokeObjectURL(selectedFileUrl!)
      }
    }
  }, [selectedFileUrl, isBlobUrl])

  useEffect(() => {
    let cancelled = false
    let currentObjectUrl: string | undefined

    const loadUrl = async () => {
      const current = fileName ?? response?.fileName
      if (!current) {
        setSelectedFileUrl(undefined)
        return
      }
      const result = await getFileTrigger({ fileName: current })
      if (!cancelled) {
        if (result.data) {
          const url = URL.createObjectURL(result.data as Blob)
          currentObjectUrl = url
          setSelectedFileUrl(url)
        } else {
          setSelectedFileUrl(undefined)
        }
      } else if (result.data) {
        // If cancelled but we got data, revoke it immediately
        URL.revokeObjectURL(URL.createObjectURL(result.data as Blob))
      }
    }

    if (!isBlobUrl(selectedFileUrl)) {
      loadUrl()
    }

    return () => {
      cancelled = true
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl)
      }
    }
  }, [fileName, response, getFileTrigger, selectedFileUrl, isBlobUrl])

  const handleDeleteClick = useCallback(async () => {
    const result = await confirmDeleteAlert({
      title: t('delete_file'),
      text: t('delete_file_confirmation'),
    })

    if (result.isConfirmed) {
      if (forceDelete) {
        await deleteFile()
      } else {
        setSelectedFileName('')
        if (selectedFileUrl) {
          URL.revokeObjectURL(selectedFileUrl)
        }
        setSelectedFileUrl(undefined)
        onClear?.()
      }
    }
  }, [forceDelete, deleteFile, selectedFileUrl, onClear])

  const content = children ? (
    children({
      open: handleClick,
      isUploading: isLoading,
      selectedFileName,
      selectedFileUrl,
      response,
      error,
      deleteFile,
      isDeleting,
      getFileUrl,
      inputId,
      accept,
    })
  ) : (
    <div className={cn(className)}>
      {label && (
        <label htmlFor={inputId} className="label form-label">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleClick} variant={variant} size={size} rounded={rounded} isLoading={isLoading} disabled={disabled || isDeleting} icon={resolvedIcon}>
          {buttonText}
        </Button>

        {hasCurrent && (
          <IconButton
            type="button"
            variant="outline-danger"
            rounded="full"
            onClick={handleDeleteClick}
            isLoading={isDeleting}
            disabled={isLoading}
            aria-label="Delete"
            title="Delete"
            icon={<Trash2 className="h-4 w-4" />}
          />
        )}

        {showFileName && selectedFileName && (
          <span className="text-sm text-info" aria-live="polite">
            {selectedFileName}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <>
      <input id={inputId} ref={inputRef} type="file" name={name} accept={accept} className="hidden" onChange={handleChange} />
      {content}
    </>
  )
}

FileUpload.displayName = 'FileUpload'
