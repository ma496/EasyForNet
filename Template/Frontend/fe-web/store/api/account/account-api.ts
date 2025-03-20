import { appApi } from "@/store/api/_app-api"
import { ChangePasswordRequest } from "@/store/api/account/dto/change-password-request"
import { TokenRequest } from "@/store/api/account/dto/token-request"
import { TokenResponse } from "@/store/api/account/dto/token-response"
import { GetUserInfoResponse } from "./dto/get-user-info-response"
import { GetUserProfileResponse } from "./dto/get-user-profile-response"
import { RefreshTokenResponse } from "./dto/refresh-token-response"
import { RefreshTokenRequest } from "./dto/refresh-token-request"
import { UpdateProfileResponse } from "./dto/update-profile-response"
import { ForgetPasswordRequest } from "./dto/forget-password-request"

export const accountApi = appApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder => ({
    login: builder.mutation<TokenResponse, TokenRequest>({
      query: (input) => ({
        url: "/account/token",
        method: "POST",
        body: input
      }),
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (input) => ({
        url: "/account/change-password",
        method: "POST",
        body: input
      }),
    }),
    forgetPassword: builder.mutation<void, ForgetPasswordRequest>({
      query: (input) => ({
        url: "/account/forget-password",
        method: "POST",
        body: input
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (input) => ({
        url: "/account/reset-password",
        method: "POST",
        body: input
      }),
    }),
    getUserInfo: builder.query<GetUserInfoResponse, void>({
      query: () => ({
        url: "/account/get-info",
        method: "GET"
      })
    }),
    getUserProfile: builder.query<GetUserProfileResponse, void>({
      query: () => ({
        url: "/account/profile",
        method: "GET"
      })
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (input) => ({
        url: "/account/refresh-token",
        method: "POST",
        body: input
      })
    }),
    updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (input) => ({
        url: "/account/update-profile",
        method: "POST",
        body: input
      })
    })
  }))
})

export const { useLoginMutation, useChangePasswordMutation, useForgetPasswordMutation, useResetPasswordMutation, useGetUserInfoQuery, useLazyGetUserInfoQuery, useGetUserProfileQuery, useRefreshTokenMutation, useUpdateProfileMutation } = accountApi
