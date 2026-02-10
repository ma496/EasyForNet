import { getTranslation } from '@/i18n'
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'

const Swal = (await import('sweetalert2')).default
export const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
  showCloseButton: true,
})
export const successToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  timer: 5000,
  icon: 'success',
  timerProgressBar: true,
  showConfirmButton: false,
  showCloseButton: true,
})
export const errorToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  timer: 7000,
  icon: 'error',
  timerProgressBar: true,
  showConfirmButton: false,
  showCloseButton: true,
})

export async function sweetAlert(params: SweetAlertOptions): Promise<SweetAlertResult<unknown>> {
  const { t } = getTranslation()
  const result = await Swal.fire({
    ...params,
    confirmButtonText: params.confirmButtonText ? params.confirmButtonText : t('common.ok'),
    cancelButtonText: params.cancelButtonText ? params.cancelButtonText : t('common.cancel'),
    confirmButtonColor: params.confirmButtonColor ? params.confirmButtonColor : '#4361ee',
    cancelButtonColor: params.cancelButtonColor ? params.cancelButtonColor : '#805dca',
  })
  return result
}

export async function successAlert(params: SweetAlertOptions): Promise<SweetAlertResult<unknown>> {
  const { t } = getTranslation()
  if (!params.title) params.title = t('common.success')
  if (!params.icon) params.icon = 'success'
  return sweetAlert(params)
}

export async function errorAlert(params: SweetAlertOptions): Promise<SweetAlertResult<unknown>> {
  const { t } = getTranslation()
  if (!params.title) params.title = t('common.error')
  if (!params.icon) params.icon = 'error'
  return sweetAlert(params)
}

export async function warningAlert(params: SweetAlertOptions): Promise<SweetAlertResult<unknown>> {
  const { t } = getTranslation()
  if (!params.title) params.title = t('common.warning')
  if (!params.icon) params.icon = 'warning'
  return sweetAlert(params)
}

export async function infoAlert(params: SweetAlertOptions): Promise<SweetAlertResult<unknown>> {
  const { t } = getTranslation()
  if (!params.title) params.title = t('common.info')
  if (!params.icon) params.icon = 'info'
  return sweetAlert(params)
}

export async function confirmAlert(params: SweetAlertOptions): Promise<SweetAlertResult<unknown>> {
  const { t } = getTranslation()
  if (!params.icon) params.icon = 'question'
  if (params.showCancelButton === undefined) params.showCancelButton = true
  if (!params.confirmButtonText) params.confirmButtonText = t('common.confirm')
  if (!params.cancelButtonText) params.cancelButtonText = t('common.cancel')
  return sweetAlert(params)
}

export async function confirmDeleteAlert(params: SweetAlertOptions): Promise<SweetAlertResult<unknown>> {
  const { t } = getTranslation()
  if (!params.confirmButtonColor) params.confirmButtonColor = '#d33'
  if (!params.cancelButtonColor) params.cancelButtonColor = '#4361ee'
  if (!params.icon) params.icon = 'warning'
  if (params.showCancelButton === undefined) params.showCancelButton = true
  if (!params.confirmButtonText) params.confirmButtonText = t('common.delete_confirm')
  if (!params.cancelButtonText) params.cancelButtonText = t('common.cancel')

  return sweetAlert(params)
}
