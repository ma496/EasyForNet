import { MiddlewareAPI, isRejectedWithValue } from '@reduxjs/toolkit';
import { setError } from '../slices/errorSlice';

const ignoreEndpoints = ['getUserInfo']

const getValidationMessage = (errors: any) => {
  let message = ''
  // loop through errors array
  errors.forEach((error: any) => {
    message += `${error.reason}\n`
  })
  return message
}

const isError = (action: any, status: number): boolean => {
  // Ignore error handling for /account/get-info route
  if (ignoreEndpoints.includes(action.meta?.arg?.endpointName)) {
    return false;
  }

  let payloadStatus = action.payload?.status

  const ignoreStatuses = action.payload?.meta?.ignoreStatuses
  if (payloadStatus === status && !ignoreStatuses) {
    return true
  }
  if (payloadStatus === status && ignoreStatuses) {
    const ignoreStatus = ignoreStatuses.find((is: any) => is === status)
    return !ignoreStatus
  }

  return false
}

export const rtkErrorHandler = (api: MiddlewareAPI) => (next: any) => (action: any) => {
  if (isRejectedWithValue(action)) {
    if (action.payload?.status === 'FETCH_ERROR') {
      api.dispatch(setError({ title: 'Connection Error', message: 'Unable to connect to the server. Please check your connection or try again later.' }))
    } else if (isError(action, 400) && action.payload.data.errors) {
      api.dispatch(setError({ title: 'Error', message: getValidationMessage(action.payload.data.errors) }))
    } else if (isError(action, 401)) {
      api.dispatch(setError({ title: 'Error', message: 'Please sign-in!' }))
    } else if (isError(action, 403)) {
      api.dispatch(setError({ title: 'Error', message: 'You are not allowed to access this resource!' }))
    } else if (isError(action, 404)) {
      api.dispatch(setError({ title: 'Error', message: 'Not Found!' }))
    } else if (isError(action, 415)) {
      api.dispatch(setError({ title: 'Error', message: 'Unsupported Media Type!' }))
    } else if (isError(action, 500)) {
      api.dispatch(setError({ title: 'Error', message: 'Internal Server Error!' }))
    }
  }

  return next(action);
};
