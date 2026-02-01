import type { Middleware } from '@reduxjs/toolkit'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import { rtkErrorHandler } from '@/lib/utils'

const ignoreEndpoints = ['getUserInfo']

export const rtkErrorMiddleware: Middleware = (_api) => (next) => (action: unknown) => {
  if (isRejectedWithValue(action)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rejectedAction = action as any
    if (ignoreEndpoints.includes(rejectedAction.meta?.arg?.endpointName)) return next(action)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = rejectedAction.payload ?? rejectedAction.error
    rtkErrorHandler(payload, rejectedAction.meta?.arg?.originalArgs?.ignoreStatuses)
  }
  return next(action)
}
