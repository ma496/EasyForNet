import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetUserInfoResponse } from '../api/identity/account/dto/get-user-info-response'
import { AuthState } from '@/lib/utils'

const initialState: AuthState = {
  user: undefined,
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo(state, { payload }: PayloadAction<GetUserInfoResponse | undefined>) {
      state.user = payload
      state.isAuthenticated = payload !== undefined
    },
    logout(state) {
      state.user = undefined
      state.isAuthenticated = false
    },
  },
})

export const { setUserInfo, logout } = authSlice.actions
