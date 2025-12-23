import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { environment } from '@/config/environment'

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: environment.apiUrl,
    prepareHeaders: (headers) => {
      return headers
    },
    credentials: 'include',
  }),
  endpoints: () => ({}),
})
