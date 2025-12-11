import { configureStore } from '@reduxjs/toolkit'
import { appApi } from '@/store/api/_app-api'
import { themeConfigSlice } from '@/store/slices/themeConfigSlice'
import { authSlice } from '@/store/slices/authSlice'
import { rtkErrorMiddleware } from '@/store/middlewares/rtk-error-middleware'

export const store = configureStore({
  reducer: {
    [themeConfigSlice.name]: themeConfigSlice.reducer,
    [appApi.reducerPath]: appApi.reducer,
    [authSlice.name]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(rtkErrorMiddleware, appApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
