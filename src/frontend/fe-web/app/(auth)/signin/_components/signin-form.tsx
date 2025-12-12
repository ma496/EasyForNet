'use client'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { Formik, Form } from 'formik'
import { FormInput } from '@/components/ui/form-input'
import { useLoginMutation } from '@/store/api/identity/account/account-api'
import { useLazyGetUserInfoQuery } from '@/store/api/identity/account/account-api'
import { useAppDispatch } from '@/store/hooks'
import { login, setUserInfo } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { FormPasswordInput } from '@/components/ui/form-password-input'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'

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
  const dispatch = useAppDispatch()

  const submitForm = async (values: LoginFormValues) => {
    const loginRes = await loginApi(values)
    if (loginRes.data) {
      dispatch(login(loginRes.data))
    }
    const userInfoRes = await getUserInfo()
    if (userInfoRes.data) {
      dispatch(setUserInfo(userInfoRes.data))
      router.push(`/app`, { scroll: false })
    }
  }

  return (
    <Formik initialValues={{ username: '', password: '' }} validationSchema={validationSchema} onSubmit={submitForm}>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-5 dark:text-white">
          <FormInput label={t('label_username')} name="username" placeholder={t('placeholder_username')} icon={<Mail size={16} />} autoFocus={true} />
          <FormPasswordInput label={t('label_password')} name="password" placeholder={t('placeholder_password')} icon={<Lock size={16} />} />

          <div className="text-right">
            <Link href="/forget-password" className="text-sm text-primary hover:underline dark:text-white">
              {t('link_forgotPassword')}
            </Link>
          </div>

          <Button type="submit" className="btn mt-6! w-full border-0 btn-gradient uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]" isLoading={isLogin || isLoadingUserInfo}>
            {t('button_signin')}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default SigninForm
