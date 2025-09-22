'use client'

import { useGetUserProfileQuery, useLazyGetUserInfoQuery, useUpdateProfileMutation } from '@/store/api/identity/account/account-api'
import { FormInput } from '@/components/ui/form-input'
import Swal from 'sweetalert2'
import { useAppDispatch } from '@/store/hooks'
import { setUserInfo } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { getTranslation } from '@/i18n'

const createValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    firstName: Yup.string().required(t('validation_firstNameRequired')),
    lastName: Yup.string().required(t('validation_lastNameRequired')),
    email: Yup.string().required(t('validation_emailRequired')).email(t('validation_invalidEmail')),
    image: Yup.mixed().nullable(),
  })
}

export const UpdateProfile = () => {
  const dispatch = useAppDispatch()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const { data: userProfile, isLoading: isLoadingUserProfile } = useGetUserProfileQuery()
  const [getUserInfo] = useLazyGetUserInfoQuery()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false)
  const { t } = getTranslation()

  const validationSchema = createValidationSchema(t)
  type UpdateProfileFormValues = Yup.InferType<typeof validationSchema>

  useEffect(() => {
    if (userProfile?.image?.imageBase64) {
      const imageUrl = `data:${userProfile.image.contentType};base64,${userProfile.image.imageBase64}`
      setImagePreview(imageUrl)
    }
  }, [userProfile])

  if (isLoadingUserProfile) {
    return <div>{t('loading')}</div>
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      // Revoke previous URL if exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      // Create new URL for preview
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)
      setFieldValue('image', file)
      setIsAvatarDeleted(false)
    }
  }

  const handleDeleteAvatar = async (setFieldValue: (field: string, value: any) => void) => {
    const result = await Swal.fire({
      title: t('delete_avatar_title'),
      text: t('delete_avatar_confirmation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('delete_confirm'),
      cancelButtonText: t('delete_cancel')
    })

    if (result.isConfirmed) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      setImagePreview(null)
      setIsAvatarDeleted(true)
      setFieldValue('image', null)
    }
  }

  const handleSubmit = async (values: UpdateProfileFormValues) => {
    const formData = new FormData()
    formData.append('firstName', values.firstName)
    formData.append('lastName', values.lastName)
    formData.append('email', values.email)

    // Only append image if it's not deleted and either new or existing
    if (!isAvatarDeleted) {
      if (values.image instanceof File) {
        formData.append('image', values.image)
      } else if (userProfile?.image?.imageBase64) {
        const base64Response = await fetch(`data:${userProfile.image.contentType};base64,${userProfile.image.imageBase64}`)
        const blob = await base64Response.blob()
        const file = new File([blob], userProfile.image.fileName, { type: userProfile.image.contentType })
        formData.append('image', file)
      }
    }

    const response = await updateProfile(formData)
    if (!response.error) {
      const userInfo = await getUserInfo()
      if (userInfo.data) {
        dispatch(setUserInfo(userInfo.data))
      }
      await Swal.fire({
        icon: 'success',
        title: t('success'),
        text: t('success_profileUpdated'),
      })
    }
  }

  return (
    <div className="panel flex flex-col gap-4 min-w-[300px] sm:min-w-[500px]">
      <Formik
        initialValues={{
          firstName: userProfile?.firstName || '',
          lastName: userProfile?.lastName || '',
          email: userProfile?.email || '',
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form noValidate className="space-y-6 max-w-md">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={imagePreview || "/assets/images/default-avatar.svg"}
                  alt={t('alt_profileImage')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('imageInput')?.click()}
                  className="p-2"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline-danger"
                  className="p-2"
                  disabled={!imagePreview}
                  onClick={() => handleDeleteAvatar(setFieldValue)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, setFieldValue)}
              />
            </div>

            <div>
              <FormInput
                label={t('label_firstName')}
                name="firstName"
                type="text"
                placeholder={t('placeholder_firstName')}
              />
            </div>

            <div>
              <FormInput
                label={t('label_lastName')}
                name="lastName"
                type="text"
                placeholder={t('placeholder_lastName')}
              />
            </div>

            <div>
              <FormInput
                label={t('label_email')}
                name="email"
                type="email"
                placeholder={t('placeholder_email')}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isUpdating || isLoadingUserProfile}
              >
                {t('update')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
