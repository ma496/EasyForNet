// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import themeConfigSlice from '@/store/themeConfigSlice';

// const rootReducer = combineReducers({
//   themeConfig: themeConfigSlice,
// });

// export default configureStore({
//   reducer: rootReducer,
// });

// export type IRootState = ReturnType<typeof rootReducer>;


import { configureStore } from '@reduxjs/toolkit'
import { appApi } from '@/store/api/_app-api'
// import { themeConfigSlice } from '@/store/themeConfigSlice'
import themeConfigSlice from '@/store/themeConfigSlice'
import { errorSlice } from '@/store/slices/errorSlice'
import { rtkErrorHandler } from '@/store/middlewares'
import { authSlice } from '@/store/slices/authSlice'

export const store = configureStore({
  reducer: {
    theme: themeConfigSlice,
    [appApi.reducerPath]: appApi.reducer,
    [errorSlice.name]: errorSlice.reducer,
    [authSlice.name]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rtkErrorHandler, appApi.middleware), // you can add custom middleware
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
