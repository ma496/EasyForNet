'use client'

import { useGetUserProfileQuery, useLazyGetUserInfoQuery, useUpdateProfileMutation } from '@/store/api/identity/account/account-api'
import { FormInput } from '@/components/ui/form/form-input'
import { useAppDispatch } from '@/store/hooks'
import { setUserInfo } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { Mail, Pencil, Trash2, User } from 'lucide-react'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { getTranslation } from '@/i18n'
import { UpdateProfileRequest } from '@/store/api/identity/account/account-dtos'
import { confirmDeleteAlert, successToast } from '@/lib/utils'
import { FileUpload } from '@/components/ui/form/file-upload'
import { IconButton } from '@/components/ui/icon-button'

const createValidationSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return Yup.object({
    firstName: Yup.string().when('lastName', {
      is: (lastName: string) => lastName && lastName.length > 0,
      then: (schema) => schema.required(t('validation.required')),
      otherwise: (schema) => schema.optional(),
    }),
    lastName: Yup.string().optional(),
    email: Yup.string()
      .required(t('validation.required'))
      .email(t('validation.invalidEmail')),
    image: Yup.string().optional(),
  })
}

export const UpdateProfile = () => {
  const dispatch = useAppDispatch()
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation()
  const { data: userProfile, isLoading: isLoadingUserProfile } = useGetUserProfileQuery()
  const [getUserInfo] = useLazyGetUserInfoQuery()
  const { t } = getTranslation()

  const validationSchema = createValidationSchema(t)
  type UpdateProfileFormValues = Yup.InferType<typeof validationSchema>

  useEffect(() => { }, [])

  if (isLoadingUserProfile) {
    return <div>{t('common.loading')}</div>
  }

  const handleSubmit = async (values: UpdateProfileFormValues) => {
    await updateProfile(values as UpdateProfileRequest)

    const userInfo = await getUserInfo()
    if (userInfo.data) {
      dispatch(setUserInfo(userInfo.data))
      successToast.fire({
        title: t('page.profile.updateSuccess'),
      })
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik
        initialValues={{
          firstName: userProfile?.firstName || '',
          lastName: userProfile?.lastName || '',
          email: userProfile?.email || '',
          image: userProfile?.image || undefined,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form noValidate className="max-w-md space-y-6">
            <div className="mb-6 flex flex-col items-center gap-4">
              <FileUpload
                name="profile-image"
                accept="image/*"
                maxSizeBytes={10 * 1024 * 1024}
                fileName={values.image}
                onUploaded={(res) => {
                  setFieldValue('image', res.fileName)
                }}
                onClear={() => {
                  setFieldValue('image', undefined)
                }}
              >
                {({ open, isUploading, isDeleting, deleteFile, selectedFileUrl }) => (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-full">
                      <img
                        src={selectedFileUrl || '/assets/images/default-avatar.svg'}
                        alt={t('page.profile.altImage')}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <IconButton
                        variant="outline"
                        rounded="full"
                        onClick={open}
                        aria-label="Edit"
                        title="Edit"
                        icon={<Pencil className="h-4 w-4" />}
                        isLoading={isUploading}
                        disabled={isUploading || isDeleting}
                      />
                      <IconButton
                        variant="outline-danger"
                        rounded="full"
                        onClick={async () => {
                          const result = await confirmDeleteAlert({
                            title: t('page.profile.deleteAvatarTitle'),
                            text: t('page.profile.deleteAvatarConfirm'),
                          })
                          if (result.isConfirmed) {
                            await deleteFile()
                            setFieldValue('image', undefined)
                          }
                        }}
                        aria-label="Delete"
                        title="Delete"
                        icon={<Trash2 className="h-4 w-4" />}
                        isLoading={isDeleting}
                        disabled={isUploading || isDeleting || (!selectedFileUrl && !values.image)}
                      />
                    </div>
                  </div>
                )}
              </FileUpload>
            </div>

            <div>
              <FormInput label={t('form.label.firstName')} name="firstName" type="text" placeholder={t('form.placeholder.firstName')} autoFocus={true} icon={<User size={18} />} />
            </div>

            <div>
              <FormInput label={t('form.label.lastName')} name="lastName" type="text" placeholder={t('form.placeholder.lastName')} icon={<User size={18} />} />
            </div>

            <div>
              <FormInput label={t('form.label.email')} name="email" type="email" placeholder={t('form.placeholder.email')} icon={<Mail size={18} />} required={true} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isUpdatingProfile || isLoadingUserProfile}>
                {t('common.submit')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
