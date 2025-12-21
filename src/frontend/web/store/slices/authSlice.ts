import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetUserInfoResponse } from '../api/identity/account/dto/get-user-info-response'
import { TokenResponse } from '../api/identity/account/dto/token-response'
import { AuthState, setToken } from '@/lib/utils'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo(state, { payload }: PayloadAction<GetUserInfoResponse | null>) {
      state.user = payload
      state.isAuthenticated = payload !== null
    },
    login(state, { payload }: PayloadAction<TokenResponse>) {
      setToken(payload)
      state.user = null
      state.isAuthenticated = true
    },
    logout(state) {
      setToken(null)
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUserInfo, login, logout } = authSlice.actions
