import { getToken, isTokenExpired, refreshToken, setLocalStorageValue } from '@/lib/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { localeStorageConst } from '@/lib/constants'
import { environment } from '@/config/environment'

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: environment.apiUrl,
    prepareHeaders: async (headers, api) => {
      if (api.endpoint === 'login') return headers
      const tokenInfo = getToken()
      if (tokenInfo && tokenInfo.accessToken) {
        if (isTokenExpired(tokenInfo.accessToken)) {
          const refreshTokenInfo = await refreshToken(tokenInfo.userId, tokenInfo.refreshToken)
          if (refreshTokenInfo && refreshTokenInfo.accessToken) {
            setLocalStorageValue(localeStorageConst.login, refreshTokenInfo)
            headers.set('authorization', `Bearer ${refreshTokenInfo.accessToken}`)
          }
        } else {
          headers.set('authorization', `Bearer ${tokenInfo.accessToken}`)
        }
      }
      return headers
    },
  }),
  endpoints: () => ({}),
})
