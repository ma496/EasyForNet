import { configureStore } from '@reduxjs/toolkit'
import { appApi } from '@/store/api/_app-api'
import { themeConfigSlice } from '@/store/slices/themeConfigSlice'
import { errorSlice } from '@/store/slices/errorSlice'
import { rtkErrorHandler } from '@/store/middlewares'
import { authSlice } from '@/store/slices/authSlice'

export const store = configureStore({
  reducer: {
    [themeConfigSlice.name]: themeConfigSlice.reducer,
    [appApi.reducerPath]: appApi.reducer,
    [errorSlice.name]: errorSlice.reducer,
    [authSlice.name]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rtkErrorHandler, appApi.middleware), // you can add custom middleware
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
