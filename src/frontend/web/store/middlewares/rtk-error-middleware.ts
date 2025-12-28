import type { Middleware } from '@reduxjs/toolkit'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import { rtkErrorHandler } from '@/lib/utils'

const ignoreEndpoints = ['getUserInfo']

export const rtkErrorMiddleware: Middleware = (api) => (next) => (action: any) => {
  if (isRejectedWithValue(action)) {
    if (ignoreEndpoints.includes(action.meta.arg.endpointName)) return next(action)
    const payload: any = action.payload ?? action.error
    rtkErrorHandler(payload, action.meta.arg.originalArgs.ignoreStatuses)
  }
  return next(action)
}
