'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
// import { useRouter } from 'next/navigation'
import { useLocalizedRouter } from '@/hooks/use-localized-router'
import { useForgetPasswordMutation } from '@/store/api/identity/account/account-api'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/form-input'
import { Mail } from 'lucide-react'
import { successAlert } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return Yup.object().shape({
    email: Yup.string()
      .required(t('validation.required'))
      .email(t('validation.invalidEmail')),
  })
}

export const ForgetPasswordForm = () => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  type ForgetPasswordFormValues = Yup.InferType<typeof validationSchema>
  const [forgetPassword, { isLoading: isForgettingPassword }] = useForgetPasswordMutation()
  const router = useLocalizedRouter()

  const onSubmit = async (data: ForgetPasswordFormValues) => {
    const result = await forgetPassword({
      email: data.email,
    })

    if (!result.error) {
      successAlert({
        title: t('auth.forgot_password.success'),
        text: t('auth.forgot_password.check_email'),
      })
      router.push('/signin')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form noValidate className="flex flex-col gap-4">
            <FormInput name="email" type="email" label={t('form.label.email')} placeholder={t('form.placeholder.email')} icon={<Mail size={16} />} autoFocus={true} required={true} />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isForgettingPassword}>
                {t('auth.forgot_password.button')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
