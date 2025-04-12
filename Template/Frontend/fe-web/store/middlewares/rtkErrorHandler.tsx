import { MiddlewareAPI, isRejectedWithValue } from '@reduxjs/toolkit';
import { setError } from '../slices/errorSlice';
import { getTranslation } from '@/i18n';

const ignoreEndpoints = ['getUserInfo']

const getValidationMessage = (errors: any) => {
  const { t } = getTranslation()
  let message = ''
  // loop through errors array
  errors.forEach((error: any) => {
    message += `${t(`server_error_${error.reason}`)}\n`
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
  const { t } = getTranslation()
  if (isRejectedWithValue(action)) {
    if (action.payload?.status === 'FETCH_ERROR') {
      api.dispatch(setError({ title: t('connection_error_title'), message: t('connection_error_message') }))
    } else if (isError(action, 400) && action.payload.data.errors) {
      api.dispatch(setError({ title: t('400_error_title'), message: getValidationMessage(action.payload.data.errors) }))
    } else if (isError(action, 401)) {
      api.dispatch(setError({ title: t('401_error_title'), message: t('401_error_message') }))
    } else if (isError(action, 403)) {
      api.dispatch(setError({ title: t('403_error_title'), message: t('403_error_message') }))
    } else if (isError(action, 404)) {
      api.dispatch(setError({ title: t('404_error_title'), message: t('404_error_message') }))
    } else if (isError(action, 415)) {
      api.dispatch(setError({ title: t('415_error_title'), message: t('415_error_message') }))
    } else if (isError(action, 500)) {
      api.dispatch(setError({ title: t('500_error_title'), message: t('500_error_message') }))
    }
  }

  return next(action);
};
