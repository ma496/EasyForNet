import { environment } from "@/config/environment"
import { GetUserInfoResponse } from "@/store/api/identity/account/dto/get-user-info-response"
import { RefreshTokenResponse } from "@/store/api/identity/account/dto/refresh-token-response"
import { jwtDecode } from "jwt-decode"
import { TokenResponse } from "@/store/api/identity/account/dto/token-response"
import { constants } from "."

export type AuthState = {
  user: GetUserInfoResponse | null
  isAuthenticated: boolean
}

export const isAllowed = (state: AuthState, permissions: string[]): boolean => {
  if (!state.user || !state.user.roles) return false
  if (!permissions || permissions.length === 0) return true

  // Check if any of the user's role permissions match the required permissions
  return state.user.roles.some((role) => role.permissions?.some((permission) => permissions.includes(permission.name)))
}

const cookieObj = typeof window === 'undefined' ? require('next/headers') : require('universal-cookie')

export const getToken = async () => {
  if (typeof window !== 'undefined') {
    const cookies = new cookieObj(null, { path: '/' })
    return (cookies.get(constants.signin) as TokenResponse) || null
  } else {
    const cookies = await cookieObj.cookies()
    const token = cookies.get(constants.signin)?.value
    return token ? (JSON.parse(decodeURIComponent(token)) as TokenResponse) : null
  }
}

export const setToken = (token: TokenResponse | null) => {
  if (typeof window === 'undefined') return
  const cookies = new cookieObj(null, { path: '/' })
  if (token) {
    cookies.set(constants.signin, token, { path: '/' })
  } else {
    cookies.remove(constants.signin, { path: '/' })
  }
}

export function isTokenExpired(token?: string) {
  if (!token) return true
  const decodedToken = jwtDecode(token)
  return decodedToken.exp && decodedToken.exp < Date.now() / 1000
}

export async function refreshToken(userId: string, refreshToken: string) {
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
