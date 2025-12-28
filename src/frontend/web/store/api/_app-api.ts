import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { environment } from '@/config/environment'
import { Mutex } from 'async-mutex'
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: environment.apiUrl,
  prepareHeaders: (headers) => {
    return headers
  },
  credentials: 'include',
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          {
            url: '/account/refresh-token',
            method: 'POST',
            body: {
              // The backend will read from the cookie if refreshToken is missing
              // We can include userId if available in the state, but let's try relying on the cookie + updated logic
              // However, the backend logic I wrote earlier checks `httpContext.User` which might be unauthenticated if 401.
              // So, ideally, we should pass the userId.
              userId: (api.getState() as any).auth?.user?.id ?? ''
            },
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          // Retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
          // If refresh fails, you might want to logout
          // api.dispatch(loggedOut())
        }
      } finally {
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})
