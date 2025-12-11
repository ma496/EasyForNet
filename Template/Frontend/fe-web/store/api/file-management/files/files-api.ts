import { appApi } from '@/store/api/_app-api'
import { FileUploadRequest } from './dto/file-upload-request'
import { FileUploadResponse } from './dto/file-upload-response'
import { FileGetRequest } from './dto/file-get-request'
import { FileDeleteRequest } from './dto/file-delete-request'
import { FileDeleteResponse } from './dto/file-delete-response'

export const filesApi = appApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    fileUpload: builder.mutation<FileUploadResponse, FileUploadRequest>({
      query: (input) => {
        const body = new FormData()
        body.append('file', input.file)
        return {
          url: '/file-management/upload',
          method: 'POST',
          body,
        }
      },
    }),
    fileGet: builder.query<string, FileGetRequest>({
      query: (input) => ({
        url: `/file-management/${input.fileName}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (blob: Blob) => URL.createObjectURL(blob),
      async onCacheEntryAdded(arg, { cacheEntryRemoved, getCacheEntry }) {
        await cacheEntryRemoved
        const url = getCacheEntry()?.data as string | undefined
        if (url) {
          URL.revokeObjectURL(url)
        }
      },
    }),
    fileDelete: builder.mutation<FileDeleteResponse, FileDeleteRequest>({
      query: (input) => ({
        url: `/file-management/${input.fileName}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useFileUploadMutation, useFileGetQuery, useLazyFileGetQuery, useFileDeleteMutation } = filesApi
