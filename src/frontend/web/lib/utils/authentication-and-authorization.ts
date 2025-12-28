import { GetUserInfoResponse } from "@/store/api/identity/account/dto/get-user-info-response"

export type AuthState = {
  user: GetUserInfoResponse | undefined
  isAuthenticated: boolean
}

export const isAllowed = (state: AuthState, permissions: string[]): boolean => {
  if (!state.user || !state.user.roles) return false
  if (!permissions || permissions.length === 0) return true

  // Check if any of the user's role permissions match the required permissions
  return state.user.roles.some((role) => role.permissions?.some((permission) => permissions.includes(permission.name)))
}

const cookieObj = typeof window === 'undefined' ? require('next/headers') : require('universal-cookie')

// Check for server-side HttpOnly cookie
export const hasAuthCookie = async () => {
  if (typeof window === 'undefined') {
    const cookies = await cookieObj.cookies()
    // Check for the standard ASP.NET Core cookie or configured name
    return cookies.has('.AspNetCore.Cookies') || cookies.has('refreshToken')
  }
  return false
}
