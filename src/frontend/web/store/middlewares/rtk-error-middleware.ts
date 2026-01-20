import type { Middleware } from '@reduxjs/toolkit'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import { rtkErrorHandler } from '@/lib/utils'

const ignoreEndpoints = ['getUserInfo']

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const rtkErrorMiddleware: Middleware = (_api) => (next) => (action: any) => {
  if (isRejectedWithValue(action)) {
    if (ignoreEndpoints.includes(action.meta.arg.endpointName)) return next(action)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = action.payload ?? action.error
    rtkErrorHandler(payload, action.meta.arg.originalArgs?.ignoreStatuses)
  }
  return next(action)
}
