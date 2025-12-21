import { getToken } from '@/lib/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { environment } from '@/config/environment'

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: environment.apiUrl,
    prepareHeaders: async (headers, api) => {
      const tokenInfo = await getToken()
      if (tokenInfo && tokenInfo.accessToken) {
        headers.set('authorization', `Bearer ${tokenInfo.accessToken}`)
      }
      return headers
    },
  }),
  endpoints: () => ({}),
})
