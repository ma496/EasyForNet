import { appApi } from '@/store/api/_app-api'
import { PermissionDefinitionResponse, PermissionResponse } from './permissions-dtos'

export const permissionsApi = appApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getDefinePermissions: builder.query<PermissionDefinitionResponse, void>({
      query: () => ({
        url: '/permissions/define',
        method: 'GET',
      }),
    }),
    getPermissions: builder.query<PermissionResponse, void>({
      query: () => ({
        url: '/permissions/get',
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetDefinePermissionsQuery, useLazyGetDefinePermissionsQuery, useGetPermissionsQuery, useLazyGetPermissionsQuery } = permissionsApi
