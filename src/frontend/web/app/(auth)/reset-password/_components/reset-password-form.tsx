'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter, useSearchParams } from 'next/navigation'
import { useResetPasswordMutation } from '@/store/api/identity/account/account-api'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormPasswordInput } from '@/components/ui/form/form-password-input'
import { Lock } from 'lucide-react'
import { errorAlert, successAlert } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return Yup.object().shape({
    password: Yup.string()
      .required(t('validation_required'))
      .min(8, t('validation_minLength', { min: 8 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    confirmPassword: Yup.string()
      .required(t('validation_required'))
      .oneOf([Yup.ref('password')], t('validation_mustMatch', { otherField: t('label_new_password') })),
  })
}

export const ResetPasswordForm = () => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  type ResetPasswordFormValues = Yup.InferType<typeof validationSchema>
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      errorAlert({
        text: t('invalid_or_expired_token'),
      })
      return
    }

    const result = await resetPassword({
      token,
      password: data.password,
    })

    if (!result.error) {
      successAlert({
        title: t('reset_password_success'),
        text: t('password_has_been_reset'),
      })
      router.push('/signin')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form noValidate className="flex flex-col gap-4">
            <FormPasswordInput name="password" label={t('label_new_password')} placeholder={t('placeholder_new_password')} icon={<Lock size={16} />} autoFocus={true} required={true} />
            <FormPasswordInput name="confirmPassword" label={t('label_confirm_password')} placeholder={t('placeholder_confirm_password')} icon={<Lock size={16} />} required={true} />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isResettingPassword}>
                {t('reset_password')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
