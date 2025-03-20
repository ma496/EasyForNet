import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { GetUserInfoResponse } from "../api/account/dto/get-user-info-response"
import { TokenResponse } from "../api/account/dto/token-response"
import { localeStorageConst } from "@/lib/constants"
import { setLocalStorageValue } from "@/lib/utils"

type AuthState = {
  user: GetUserInfoResponse | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false
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
      setLocalStorageValue(localeStorageConst.login, payload)
      state.user = null
      state.isAuthenticated = true
    },
    logout(state) {
      setLocalStorageValue(localeStorageConst.login, null)
      state.user = null
      state.isAuthenticated = false
    }
  }
})

export const {
  setUserInfo,
  login,
  logout
} = authSlice.actions
