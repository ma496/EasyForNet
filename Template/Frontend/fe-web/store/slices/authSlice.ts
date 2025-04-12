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

// Add new selector function
export const isAllowed = (state: AuthState, permissions: string[]): boolean => {
  if (!state.user || !state.user.roles) return false;
  if (!permissions || permissions.length === 0) return true;

  // console.log(permissions)

  // Check if any of the user's role permissions match the required permissions
  return state.user.roles.some(role =>
    role.permissions?.some(permission =>
      permissions.includes(permission.name)
    )
  );
};