import { getLocalStorageValue, setLocalStorageValue } from '@/lib/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { localeStorageConst } from '@/lib/constants'
import { environment } from '@/config/environment'
import { TokenResponse } from '@/store/api/account/dto/token-response'
import { jwtDecode } from 'jwt-decode'
import { RefreshTokenResponse } from './account/dto/refresh-token-response'

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: environment.apiUrl,
    prepareHeaders: async (headers, api) => {
      if (api.endpoint === 'login') return headers
      const tokenInfo = getLocalStorageValue<TokenResponse>(localeStorageConst.login)
      if (tokenInfo && tokenInfo.accessToken) {
        if (isTokenExpired(tokenInfo.accessToken)) {
          const refreshTokenInfo = await refreshToken(tokenInfo.userId, tokenInfo.refreshToken)
          if (refreshTokenInfo && refreshTokenInfo.accessToken) {
            setLocalStorageValue(localeStorageConst.login, refreshTokenInfo)
            headers.set('authorization', `Bearer ${refreshTokenInfo.accessToken}`)
          }
        }
        else {
          headers.set('authorization', `Bearer ${tokenInfo.accessToken}`)
        }
      }
      return headers
    },
  }),
  endpoints: () => ({}),
})

function isTokenExpired(token: string) {
  const decodedToken = jwtDecode(token)
  return decodedToken.exp && decodedToken.exp < Date.now() / 1000
}

async function refreshToken(userId: string, refreshToken: string) {
  const result = await fetch(`${environment.apiUrl}/account/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, refreshToken }),
  })
  if (result.ok) {
    const data: RefreshTokenResponse = await result.json()
    return data
  }
  return null
}

