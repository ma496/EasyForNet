'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useForgetPasswordMutation } from '@/store/api/identity/account/account-api'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-input'
import { Mail } from 'lucide-react'
import { successAlert } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: any) => string) => {
  return Yup.object().shape({
    email: Yup.string()
      .required(t('validation_required'))
      .email(t('validation_invalidEmail')),
  })
}

export const ForgetPasswordForm = () => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  type ForgetPasswordFormValues = Yup.InferType<typeof validationSchema>
  const [forgetPassword, { isLoading: isForgettingPassword }] = useForgetPasswordMutation()
  const router = useRouter()

  const onSubmit = async (data: ForgetPasswordFormValues) => {
    const result = await forgetPassword({
      email: data.email,
    })

    if (!result.error) {
      successAlert({
        title: t('forget_password_success'),
        text: t('forget_password_check_email'),
        icon: 'success',
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
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form noValidate className="flex flex-col gap-4">
            <FormInput name="email" type="email" label={t('label_email')} placeholder={t('placeholder_email')} icon={<Mail size={16} />} autoFocus={true} />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isForgettingPassword}>
                {t('send_reset_link')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
