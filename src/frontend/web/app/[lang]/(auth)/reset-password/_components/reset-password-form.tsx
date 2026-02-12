'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useSearchParams } from 'next/navigation'
import { useLocalizedRouter } from '@/hooks/use-localized-router'
import { useResetPasswordMutation } from '@/store/api/identity/account/account-api'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormPasswordInput } from '@/components/ui/form/form-password-input'
import { Lock } from 'lucide-react'
import { errorAlert, successAlert } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return Yup.object().shape({
    password: Yup.string()
      .required(t('validation.required'))
      .min(8, t('validation.minLength', { min: 8 }))
      .max(50, t('validation.maxLength', { max: 50 })),
    confirmPassword: Yup.string()
      .required(t('validation.required'))
      .oneOf([Yup.ref('password')], t('validation.mustMatch', { otherField: t('form.label.newPassword') })),
  })
}

export const ResetPasswordForm = () => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  type ResetPasswordFormValues = Yup.InferType<typeof validationSchema>
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation()
  const router = useLocalizedRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      errorAlert({
        text: t('error.server.invalidToken'),
      })
      return
    }

    const result = await resetPassword({
      token,
      password: data.password,
    })

    if (!result.error) {
      successAlert({
        title: t('page.auth.resetPassword.success'),
        text: t('page.auth.resetPassword.hasBeenReset'),
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
            <FormPasswordInput name="password" label={t('form.label.newPassword')} placeholder={t('form.placeholder.newPassword')} icon={<Lock size={16} />} autoFocus={true} required={true} />
            <FormPasswordInput name="confirmPassword" label={t('form.label.confirmPassword')} placeholder={t('form.placeholder.confirmPassword')} icon={<Lock size={16} />} required={true} />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isResettingPassword}>
                {t('page.auth.resetPassword.button')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
