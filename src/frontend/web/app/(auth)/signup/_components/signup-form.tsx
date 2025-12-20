'use client'

import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { Formik, Form } from 'formik'
import { FormInput } from '@/components/ui/form-input'
import { useSignupMutation, useResendVerifyEmailMutation } from '@/store/api/identity/account/account-api'
import { Button } from '@/components/ui/button'
import { FormPasswordInput } from '@/components/ui/form-password-input'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { Toast } from '@/lib/utils/notification'

const SignupForm = () => {
  const router = useRouter()
  const { t } = getTranslation()
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
  const [registeredEmail, setRegisteredEmail] = useState<string>('')
  const [countdown, setCountdown] = useState(0)

  const [signupApi, { isLoading }] = useSignupMutation()
  const [resendVerifyEmailApi, { isLoading: isResending }] = useResendVerifyEmailMutation()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('validation_required'))
      .min(3, t('validation_minLength', { count: 3 }))
      .max(50, t('validation_maxLength', { count: 50 })),
    email: Yup.string()
      .required(t('validation_required'))
      .email(t('validation_email'))
      .max(100, t('validation_maxLength', { count: 100 })),
    password: Yup.string()
      .required(t('validation_required'))
      .min(8, t('validation_minLength', { count: 8 }))
      .max(50, t('validation_maxLength', { count: 50 })),
    confirmPassword: Yup.string()
      .required(t('validation_required'))
      .oneOf([Yup.ref('password')], t('validation_mustMatch', { otherField: t('label_password') })),
  })

  type SignupFormValues = Yup.InferType<typeof validationSchema>

  const submitForm = async (values: SignupFormValues) => {
    const response = await signupApi(values)
    if (response.error) {
      return
    }

    setRegisteredEmail(values.email)
    if (response.data?.isEmailVerificationRequired) {
      setSuccessMessage(t('msg_signup_success_verify_email'))
      setCountdown(15)
    } else {
      setSuccessMessage(t('msg_signup_success'))
    }
  }

  const handleResendEmail = async () => {
    if (countdown > 0 || isResending) return

    try {
      const response = await resendVerifyEmailApi({ emailOrUsername: registeredEmail })
      if (response.error) {
        return
      }
      Toast.fire({
        title: t('msg_resend_email_success'),
        icon: 'success',
      })
      setCountdown(15)
    } catch (error) {
      // Error is handled by api middleware/toast
    }
  }

  if (successMessage) {
    const isVerificationRequired = successMessage === t('msg_signup_success_verify_email')

    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center dark:text-white">
        <CheckCircle size={48} className="text-green-500" />
        <h2 className="text-2xl font-bold">{t('title_signup_success')}</h2>
        <p>{successMessage}</p>

        {isVerificationRequired && (
          <Button
            type="button"
            className="btn btn-outline-primary w-full mt-2"
            onClick={handleResendEmail}
            disabled={countdown > 0 || isResending}
            isLoading={isResending}
          >
            {countdown > 0 ? t('text_resend_email_wait', { seconds: countdown }) : t('button_resend_email')}
          </Button>
        )}

        <Link href="/signin" className="btn btn-primary w-full mt-2">
          {t('button_back_to_signin')}
        </Link>
      </div>
    )
  }

  return (
    <Formik initialValues={{ username: '', email: '', password: '', confirmPassword: '' }} validationSchema={validationSchema} onSubmit={submitForm}>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-5 dark:text-white">
          <FormInput label={t('label_username')} name="username" placeholder={t('placeholder_username')} icon={<Mail size={16} />} autoFocus={true} />
          <FormInput label={t('label_email')} name="email" placeholder={t('placeholder_email')} icon={<Mail size={16} />} />
          <FormPasswordInput label={t('label_password')} name="password" placeholder={t('placeholder_password')} icon={<Lock size={16} />} />
          <FormPasswordInput label={t('label_confirm_password')} name="confirmPassword" placeholder={t('placeholder_confirm_password')} icon={<Lock size={16} />} />

          <div className="flex justify-end gap-2">
            <span className="text-sm">{t('text_already_have_account')}</span>
            <Link href="/signin" className="text-sm text-primary hover:underline dark:text-white">
              {t('link_signin')}
            </Link>
          </div>

          <Button type="submit" className="btn w-full border-0 btn-gradient uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]" isLoading={isLoading}>
            {t('button_signup')}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default SignupForm
