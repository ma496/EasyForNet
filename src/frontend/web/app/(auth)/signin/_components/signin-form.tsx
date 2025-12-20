'use client'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { Formik, Form } from 'formik'
import { FormInput } from '@/components/ui/form-input'
import { Mail, Lock, Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLoginMutation, useLazyGetUserInfoQuery, useResendVerifyEmailMutation } from '@/store/api/identity/account/account-api'
import { useAppDispatch } from '@/store/hooks'
import { login, setUserInfo } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { FormPasswordInput } from '@/components/ui/form-password-input'
import Link from 'next/link'
import { Toast } from '@/lib/utils/notification'

const SigninForm = () => {
  const router = useRouter()
  const { t } = getTranslation()

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('validation_required'))
      .min(3, t('validation_minLength', { count: 3 }))
      .max(50, t('validation_maxLength', { count: 50 })),
    password: Yup.string()
      .required(t('validation_required'))
      .min(8, t('validation_minLength', { count: 8 }))
      .max(50, t('validation_maxLength', { count: 50 })),
  })

  type LoginFormValues = Yup.InferType<typeof validationSchema>

  const [loginApi, { isLoading: isLogin }] = useLoginMutation()
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

  const submitForm = async (values: LoginFormValues) => {
    const loginRes = await loginApi(values)
    if (loginRes.error) {
      const errorData = (loginRes.error as any).data
      const verificationError = errorData?.errors?.find((err: any) => err.code === 'email_not_verified')
      if (verificationError) {
        setRegisteredEmail(values.username) // In this app username can be email or username
        setShowVerificationMessage(true)
      }
      return
    }

    if (loginRes.data) {
      dispatch(login(loginRes.data))
    }
    const userInfoRes = await getUserInfo()
    if (!loginRes.error && userInfoRes.data) {
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
    Toast.fire({
      title: t('msg_resend_email_success'),
      icon: 'success',
    })
    setCountdown(15)
  }

  if (showVerificationMessage) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center dark:text-white">
        <Info size={48} className="text-primary" />
        <h2 className="text-2xl font-bold">{t('title_email_not_verified')}</h2>
        <p>{t('msg_email_not_verified')}</p>

        <Button
          type="button"
          className="btn btn-outline-primary w-full mt-2"
          onClick={handleResendEmail}
          disabled={countdown > 0 || isResending}
          isLoading={isResending}
        >
          {countdown > 0 ? t('text_resend_email_wait', { seconds: countdown }) : t('button_resend_email')}
        </Button>

        <Button type="button" className="btn btn-primary w-full mt-2" onClick={() => setShowVerificationMessage(false)}>
          {t('button_back_to_signin')}
        </Button>
      </div>
    )
  }

  return (
    <Formik initialValues={{ username: '', password: '' }} validationSchema={validationSchema} onSubmit={submitForm}>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-5 dark:text-white">
          <FormInput label={t('label_username')} name="username" placeholder={t('placeholder_username')} icon={<Mail size={16} />} autoFocus={true} />
          <FormPasswordInput label={t('label_password')} name="password" placeholder={t('placeholder_password')} icon={<Lock size={16} />} />

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="text-sm dark:text-gray-400">{t('text_dont_have_account')}</span>
              <Link href="/signup" className="text-sm text-primary hover:underline dark:text-white">
                {t('link_signup')}
              </Link>
            </div>
            <Link href="/forget-password" className="text-sm text-primary hover:underline dark:text-white">
              {t('link_forgotPassword')}
            </Link>
          </div>

          <Button type="submit" className="btn w-full border-0 btn-gradient uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]" isLoading={isLogin || isLoadingUserInfo}>
            {t('button_signin')}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default SigninForm
