import { appApi } from '@/store/api/_app-api'
import { FileDeleteRequest, FileDeleteResponse, FileGetRequest, FileUploadRequest, FileUploadResponse } from './files-dtos'

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
    fileGet: builder.query<Blob, FileGetRequest>({
      query: (input) => ({
        url: `/file-management/${input.fileName}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
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
