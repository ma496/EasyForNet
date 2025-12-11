import { appApi } from '@/store/api/_app-api'
import { PermissionDefinitionResponse } from './dto/permission-definition-response'
import { PermissionResponse } from './dto/permission-response'

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
