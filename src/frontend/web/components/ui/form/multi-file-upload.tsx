'use client'
import React, { useId, useState, useCallback, useEffect } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { cn, confirmDeleteAlert } from '@/lib/utils'
import { getTranslation } from '@/i18n'
import { IconButton } from '@/components/ui/icon-button'
import { useFileUploadMutation, useLazyFileGetQuery, useFileDeleteMutation } from '@/store/api/file-management/files/files-api'
import { ReactSortable } from 'react-sortablejs'

interface MultiFileUploadProps {
  label?: string
  name: string
  fileNames?: string[]
  onFilesChanged: (fileNames: string[]) => void
  maxSizeBytes?: number
  accept?: string
}

export const MultiFileUpload = ({
  label,
  name,
  fileNames = [],
  onFilesChanged,
  maxSizeBytes = 10 * 1024 * 1024,
  accept = 'image/*'
}: MultiFileUploadProps) => {
  const { t } = getTranslation()
  const inputId = useId()
  const [uploadFile, { isLoading: isUploading }] = useFileUploadMutation()
  const [deleteFile] = useFileDeleteMutation()
  const [getFileTrigger] = useLazyFileGetQuery()
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({})

  const loadFileUrls = useCallback(async (names: string[]) => {
    const urls: { [key: string]: string } = {}
    for (const fileName of names) {
      if (!fileUrls[fileName]) {
        const result = await getFileTrigger({ fileName, ignoreStatuses: [404] })
        if (result.data) {
          const blob = result.data as Blob
          const url = URL.createObjectURL(blob)
          urls[fileName] = url
        }
      } else {
        urls[fileName] = fileUrls[fileName]
      }
    }
    setFileUrls(prev => ({ ...prev, ...urls }))
  }, [getFileTrigger, fileUrls])

  useEffect(() => {
    loadFileUrls(fileNames)
  }, [fileNames])

  useEffect(() => {
    return () => {
      // Cleanup all object URLs on unmount
      Object.values(fileUrls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [fileUrls])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newFileNames = [...fileNames]
    for (const file of files) {
      if (file.size > maxSizeBytes) {
        continue
      }

      const res = await uploadFile({ file })
      if (res.data) {
        newFileNames.push(res.data.fileName)
        const url = URL.createObjectURL(file)
        setFileUrls(prev => ({ ...prev, [res.data!.fileName]: url }))
      }
    }
    onFilesChanged(newFileNames)
    e.target.value = ''
  }

  const handleRemove = async (index: number) => {
    const fileNameToRemove = fileNames[index]
    const result = await confirmDeleteAlert({
      title: t('delete_file'),
      text: t('delete_file_confirmation'),
    })

    if (result.isConfirmed) {
      await deleteFile({ fileName: fileNameToRemove })
      const newFileNames = [...fileNames]
      newFileNames.splice(index, 1)
      onFilesChanged(newFileNames)

      if (fileUrls[fileNameToRemove]) {
        URL.revokeObjectURL(fileUrls[fileNameToRemove])
        const newUrls = { ...fileUrls }
        delete newUrls[fileNameToRemove]
        setFileUrls(newUrls)
      }
    }
  }

  return (
    <div className="space-y-4">
      {label && <label htmlFor={inputId} className="label form-label">{label}</label>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <ReactSortable
          list={fileNames.map(name => ({ id: name, name }))}
          setList={(newList) => onFilesChanged(newList.map(item => item.name))}
          className="contents"
          animation={200}
          ghostClass="opacity-50"
        >
          {fileNames.map((fileName, index) => (
            <div key={fileName} className="group relative aspect-square cursor-move overflow-hidden rounded-lg border border-white-light dark:border-[#17263c]">
              {fileUrls[fileName] ? (
                <img src={fileUrls[fileName]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <IconButton
                  variant="danger"
                  size="sm"
                  rounded="full"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(index)
                  }}
                />
              </div>
            </div>
          ))}
        </ReactSortable>

        <label
          htmlFor={inputId}
          className={cn(
            "flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white-light transition-colors hover:border-primary hover:bg-primary/5 dark:border-[#17263c] dark:hover:border-primary",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <>
              <Plus className="mb-2 h-8 w-8 text-gray-400" />
              <span className="text-xs text-gray-400">{t('upload')}</span>
            </>
          )}
          <input
            id={inputId}
            type="file"
            multiple
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  )
}
