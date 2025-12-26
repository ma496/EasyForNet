import { appApi } from '@/store/api/_app-api'
import { ChangePasswordRequest } from './dto/change-password-request'
import { TokenRequest } from './dto/token-request'
import { TokenResponse } from './dto/token-response'
import { GetUserInfoResponse } from './dto/get-user-info-response'
import { GetUserProfileResponse } from './dto/get-user-profile-response'
import { RefreshTokenResponse } from './dto/refresh-token-response'
import { RefreshTokenRequest } from './dto/refresh-token-request'
import { UpdateProfileResponse } from './dto/update-profile-response'
import { ForgetPasswordRequest } from './dto/forget-password-request'
import { ResetPasswordRequest } from './dto/reset-password-request'
import { UpdateProfileRequest } from './dto/update-profile-request'

import { SignupRequest } from './dto/signup-request'
import { VerifyEmailRequest } from './dto/verify-email-request'
import { SignupResponse } from './dto/signup-response'
import { ResendVerifyEmailRequest } from './dto/resend-verify-email-request'

export const accountApi = appApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    token: builder.mutation<TokenResponse, TokenRequest>({
      query: (input) => ({
        url: '/account/token',
        method: 'POST',
        body: input,
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (input) => ({
        url: '/account/signup',
        method: 'POST',
        body: input,
      }),
    }),
    verifyEmail: builder.mutation<void, VerifyEmailRequest>({
      query: (input) => ({
        url: '/account/verify-email',
        method: 'POST',
        body: input,
      }),
    }),
    resendVerifyEmail: builder.mutation<void, ResendVerifyEmailRequest>({
      query: (input) => ({
        url: '/account/resend-verify-email',
        method: 'POST',
        body: input,
      }),
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (input) => ({
        url: '/account/change-password',
        method: 'POST',
        body: input,
      }),
    }),
    forgetPassword: builder.mutation<void, ForgetPasswordRequest>({
      query: (input) => ({
        url: '/account/forget-password',
        method: 'POST',
        body: input,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (input) => ({
        url: '/account/reset-password',
        method: 'POST',
        body: input,
      }),
    }),
    getUserInfo: builder.query<GetUserInfoResponse, void>({
      query: () => ({
        url: '/account/get-info',
        method: 'GET',
      }),
    }),
    getUserProfile: builder.query<GetUserProfileResponse, void>({
      query: () => ({
        url: '/account/profile',
        method: 'GET',
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (input) => ({
        url: '/account/refresh-token',
        method: 'POST',
        body: input,
      }),
    }),
    updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (input) => ({
        url: '/account/update-profile',
        method: 'POST',
        body: input,
      }),
    }),
    signout: builder.mutation<void, void>({
      query: () => ({
        url: '/account/signout',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useTokenMutation,
  useSignupMutation,
  useVerifyEmailMutation,
  useResendVerifyEmailMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useGetUserProfileQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useSignoutMutation,
} = accountApi
