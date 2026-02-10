'use client'
// import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { Formik, Form } from 'formik'
import { FormInput } from '@/components/ui/form/form-input'
import { Mail, Lock, Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTokenMutation, useLazyGetUserInfoQuery, useResendVerifyEmailMutation } from '@/store/api/identity/account/account-api'
import { useAppDispatch } from '@/store/hooks'
import { setUserInfo } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { FormPasswordInput } from '@/components/ui/form/form-password-input'
import { LocalizedLink } from '@/components/localized-link'
import { successToast } from '@/lib/utils/notification'
import { useLocalizedRouter } from '@/hooks/use-localized-router'

const SigninForm = () => {
  const router = useLocalizedRouter()
  const { t } = getTranslation()

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('validation.required'))
      .min(3, t('validation.minLength', { min: 3 }))
      .max(50, t('validation.maxLength', { max: 50 })),
    password: Yup.string()
      .required(t('validation.required'))
      .min(8, t('validation.minLength', { min: 8 }))
      .max(50, t('validation.maxLength', { max: 50 })),
  })

  type SigninFormValues = Yup.InferType<typeof validationSchema>

  const [tokenApi, { isLoading: isTokenLoading }] = useTokenMutation()
  const [getUserInfo, { isLoading: isLoadingUserInfo }] = useLazyGetUserInfoQuery()
  const [resendVerifyEmailApi, { isLoading: isResending }] = useResendVerifyEmailMutation()
  const dispatch = useAppDispatch()

  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [countdown, setCountdown] = useState(0)

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

  const submitForm = async (values: SigninFormValues) => {
    const tokenRes = await tokenApi(values)
    if (tokenRes.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = (tokenRes.error as any).data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const verificationError = errorData?.errors?.find((err: any) => err.code === 'email_not_verified')
      if (verificationError) {
        setRegisteredEmail(values.username) // In this app username can be email or username
        setShowVerificationMessage(true)
      }
      return
    }

    if (tokenRes.error) return

    const userInfoRes = await getUserInfo()
    if (userInfoRes.data) {
      dispatch(setUserInfo(userInfoRes.data))
      if (userInfoRes.data.roles.find((role) => role.name === 'Public')) {
        router.push(`/`, { scroll: false })
      } else {
        router.push(`/app`, { scroll: false })
      }
    }
  }

  const handleResendEmail = async () => {
    if (countdown > 0 || isResending) return

    const response = await resendVerifyEmailApi({ emailOrUsername: registeredEmail })
    if (response.error) {
      return
    }
    successToast.fire({
      title: t('page.verify_email.resend_success'),
    })
    setCountdown(15)
  }

  if (showVerificationMessage) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center dark:text-white">
        <Info size={48} className="text-primary" />
        <h2 className="text-2xl font-bold">{t('page.verify_email.not_verified_title')}</h2>
        <p>{t('page.verify_email.not_verified_message')}</p>

        <Button
          type="button"
          className="btn btn-outline-primary w-full mt-2"
          onClick={handleResendEmail}
          disabled={countdown > 0 || isResending}
          isLoading={isResending}
        >
          {countdown > 0 ? t('page.verify_email.resend_wait', { seconds: countdown }) : t('page.verify_email.resend_button')}
        </Button>

        <Button type="button" className="btn btn-primary w-full mt-2" onClick={() => setShowVerificationMessage(false)}>
          {t('auth.login.back_to_signin')}
        </Button>
      </div>
    )
  }

  return (
    <Formik initialValues={{ username: '', password: '' }} validationSchema={validationSchema} onSubmit={submitForm}>
      {() => (
        <Form className="space-y-5 dark:text-white">
          <FormInput label={t('form.label.username')} name="username" placeholder={t('form.placeholder.username')} icon={<Mail size={16} />} autoFocus={true} required={true} />
          <FormPasswordInput label={t('form.label.password')} name="password" placeholder={t('form.placeholder.password')} icon={<Lock size={16} />} required={true} />

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="text-sm dark:text-gray-400">{t('auth.login.no_account')}</span>
              <LocalizedLink href="/signup" className="text-sm text-primary hover:underline dark:text-white">
                {t('auth.login.signup_link')}
              </LocalizedLink>
            </div>
            <LocalizedLink href="/forget-password" className="text-sm text-primary hover:underline dark:text-white">
              {t('auth.login.forgot_password')}
            </LocalizedLink>
          </div>

          <Button type="submit" className="btn w-full border-0 btn-gradient uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]" isLoading={isTokenLoading || isLoadingUserInfo}>
            {t('auth.login.button')}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default SigninForm
