import { getTranslation } from '@/i18n'
import { errorAlert, errorToast, isTranslationKeyExist } from '@/lib/utils'

interface ValidationError {
  name: string
  code: string | number
  reason: string
}

interface ApiErrorPayload {
  status: number | string
  data?: {
    errors?: ValidationError[]
  }
}

const getValidationMessage = (errors: ValidationError[]) => {
  const { t } = getTranslation()
  let message = ''
  // loop through errors array
  errors.forEach((error: ValidationError) => {
    // Remove the word 'Normalized' from the end of the error name, regardless of its casing.
    const name = error.name.replace(/normalized$/i, '')
    const localizeName = t(name)
    message += isTranslationKeyExist(`error.server.${error.code}`) ? `${t(`error.server.${error.code}`, { propertyName: localizeName })}\n` : `${error.reason}\n`
  })
  return message
}

const isError = (payload: ApiErrorPayload, errorStatus: number, ignoreStatuses?: number[]): boolean => {
  const payloadStatus = payload?.status

  if (payloadStatus === errorStatus && !ignoreStatuses) {
    return true
  }
  if (payloadStatus === errorStatus && ignoreStatuses) {
    const ignoreStatus = ignoreStatuses.find((is: number) => is === errorStatus)
    return !ignoreStatus
  }

  return false
}

export const rtkErrorHandler = (payload: ApiErrorPayload, ignoreStatuses?: number[]) => {
  const { t } = getTranslation()
  if (payload?.status === 'FETCH_ERROR') {
    errorToast.fire({ title: t('error.connection.title'), text: t('error.connection.message') })
  } else if (isError(payload, 400, ignoreStatuses) && payload.data?.errors) {
    errorAlert({ title: t('error.400.title'), text: getValidationMessage(payload.data?.errors || []) })
  } else if (isError(payload, 401, ignoreStatuses)) {
    errorToast.fire({ title: t('error.401.title'), text: t('error.401.message') })
  } else if (isError(payload, 403, ignoreStatuses)) {
    errorToast.fire({ title: t('error.403.title'), text: t('error.403.message') })
  } else if (isError(payload, 404, ignoreStatuses)) {
    errorToast.fire({ title: t('error.404.title'), text: t('error.404.message') })
  } else if (isError(payload, 413, ignoreStatuses)) {
    errorToast.fire({ title: t('error.413.title'), text: t('error.413.message') })
  } else if (isError(payload, 415, ignoreStatuses)) {
    errorToast.fire({ title: t('error.415.title'), text: t('error.415.message') })
  } else if (isError(payload, 500, ignoreStatuses)) {
    errorToast.fire({ title: t('error.500.title'), text: t('error.500.message') })
  }
}
