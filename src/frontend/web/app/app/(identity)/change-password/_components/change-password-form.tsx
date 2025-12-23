'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useChangePasswordMutation } from '@/store/api/identity/account/account-api'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { successAlert } from '@/lib/utils'
import { Form, Formik } from 'formik'
import { FormPasswordInput } from '@/components/ui/form/form-password-input'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

const createValidationSchema = (t: (key: string, params?: any) => string) => {
  return Yup.object().shape({
    currentPassword: Yup.string()
      .required(t('validation_required')),
    newPassword: Yup.string()
      .required(t('validation_required'))
      .min(8, t('validation_minLength', { count: 8 }))
      .max(50, t('validation_maxLength', { count: 50 })),
    confirmPassword: Yup.string()
      .required(t('validation_required'))
      .oneOf([Yup.ref('newPassword')], t('validation_mustMatch', { otherField: t('label_newPassword') })),
  })
}

export const ChangePasswordForm = () => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  type ChangePasswordFormValues = Yup.InferType<typeof validationSchema>
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })

    if (!result.error) {
      successAlert({
        title: t('change_password_success'),
      })
      dispatch(logout())
      router.push('/signin')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form noValidate className="flex flex-col gap-4">
            <FormPasswordInput name="currentPassword" label={t('label_currentPassword')} placeholder={t('placeholder_currentPassword')} icon={<Lock size={18} />} autoFocus={true} required={true} />
            <FormPasswordInput name="newPassword" label={t('label_newPassword')} placeholder={t('placeholder_newPassword')} icon={<Lock size={18} />} required={true} />
            <FormPasswordInput name="confirmPassword" label={t('label_confirmPassword')} placeholder={t('placeholder_confirmPassword')} icon={<Lock size={18} />} required={true} />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isChangingPassword}>
                {t('form_submit')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
