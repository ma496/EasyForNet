import { getTranslation } from '@/i18n'
import { errorAlert, ErrorToast, isTranslationKeyExist } from '@/lib/utils'

const getValidationMessage = (errors: any) => {
  const { t } = getTranslation()
  let message = ''
  // loop through errors array
  errors.forEach((error: any) => {
    // Remove the word 'Normalized' from the end of the error name, regardless of its casing.
    const name = error.name.replace(/normalized$/i, '')
    const localizeName = t(name)
    message += isTranslationKeyExist(`server_error_${error.code}`) ? `${t(`server_error_${error.code}`, { propertyName: localizeName })}\n` : `${error.reason}\n`
  })
  return message
}

const isError = (payload: any, errorStatus: number, ignoreStatuses?: number[]): boolean => {
  let payloadStatus = payload?.status

  if (payloadStatus === errorStatus && !ignoreStatuses) {
    return true
  }
  if (payloadStatus === errorStatus && ignoreStatuses) {
    const ignoreStatus = ignoreStatuses.find((is: any) => is === errorStatus)
    return !ignoreStatus
  }

  return false
}

export const errorHandler = (payload: any) => {
  const { t } = getTranslation()
  if (payload?.status === 'FETCH_ERROR') {
    ErrorToast.fire({ title: t('connection_error_title'), text: t('connection_error_message') })
  } else if (isError(payload, 400) && payload.data.errors) {
    errorAlert({ title: t('400_error_title'), text: getValidationMessage(payload.data.errors) })
  } else if (isError(payload, 401)) {
    ErrorToast.fire({ title: t('401_error_title'), text: t('401_error_message') })
  } else if (isError(payload, 403)) {
    ErrorToast.fire({ title: t('403_error_title'), text: t('403_error_message') })
  } else if (isError(payload, 404)) {
    ErrorToast.fire({ title: t('404_error_title'), text: t('404_error_message') })
  } else if (isError(payload, 413)) {
    ErrorToast.fire({ title: t('413_error_title'), text: t('413_error_message') })
  } else if (isError(payload, 415)) {
    ErrorToast.fire({ title: t('415_error_title'), text: t('415_error_message') })
  } else if (isError(payload, 500)) {
    ErrorToast.fire({ title: t('500_error_title'), text: t('500_error_message') })
  }
}
