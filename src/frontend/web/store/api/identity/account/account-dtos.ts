import { RequestBase } from "@/store/api/base/dto/request-base"

export interface ChangePasswordRequest extends RequestBase {
  currentPassword: string
  newPassword: string
}

export interface ForgetPasswordRequest extends RequestBase {
  email: string
}

export interface GetUserInfoResponse {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  image?: string
  roles: GetUserInfoRole[]
}

export interface GetUserInfoRole {
  id: string
  name: string
  permissions: GetUserInfoPermission[]
}

export interface GetUserInfoPermission {
  id: string
  name: string
  displayName: string
}

export interface GetUserProfileResponse {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  image?: string
}

export interface RefreshTokenRequest extends RequestBase {
  userId: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  userId: string
  accessToken: string
  refreshToken: string
}

export interface ResendVerifyEmailRequest extends RequestBase {
  emailOrUsername: string
}

export interface ResetPasswordRequest extends RequestBase {
  token: string
  password: string
}

export interface SignupRequest extends RequestBase {
  username: string
  email: string
  password?: string
  confirmPassword?: string
}

export interface SignupResponse {
  isEmailVerificationRequired: boolean
}

export interface TokenRequest extends RequestBase {
  username: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  userId: string
  refreshToken: string
}

export interface UpdateProfileRequest extends RequestBase {
  email: string
  firstName: string | undefined
  lastName: string | undefined
  image: string | undefined
}

export interface UpdateProfileResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  image?: string
}

export interface VerifyEmailRequest extends RequestBase {
  token: string
}
