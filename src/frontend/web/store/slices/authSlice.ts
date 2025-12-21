import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetUserInfoResponse } from '../api/identity/account/dto/get-user-info-response'
import { TokenResponse } from '../api/identity/account/dto/token-response'
import { AuthState, setToken } from '@/lib/utils'

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
    login(state, { payload }: PayloadAction<TokenResponse>) {
      setToken(payload)
      state.user = undefined
      state.isAuthenticated = true
    },
    logout(state) {
      setToken(undefined)
      state.user = undefined
      state.isAuthenticated = false
    },
  },
})

export const { setUserInfo, login, logout } = authSlice.actions
