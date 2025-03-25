'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup'
import { getTranslation } from '@/i18n';
import { Formik, Form } from 'formik';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '@/store/api/account/account-api';
import { useLazyGetUserInfoQuery } from '@/store/api/account/account-api';
import { useAppDispatch } from '@/store/hooks';
import { login, setUserInfo } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';

const SigninForm = () => {
  const router = useRouter();
  const { t } = getTranslation();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t('validation_usernameRequired'))
      .min(3, t('validation_usernameMin'))
      .max(50, t('validation_usernameMax')),
    password: Yup.string().required(t('validation_passwordRequired'))
      .min(8, t('validation_passwordMin'))
      .max(50, t('validation_passwordMax')),
  });

  type LoginFormValues = Yup.InferType<typeof validationSchema>

  const [loginApi, { isLoading: isLogin }] = useLoginMutation()
  const [getUserInfo, { isLoading: isLoadingUserInfo }] = useLazyGetUserInfoQuery()
  const dispatch = useAppDispatch()

  const submitForm = async (values: LoginFormValues) => {
    const loginRes = await loginApi(values)
    if (loginRes.error) {
      return
    }
    if (loginRes.data) {
      dispatch(login(loginRes.data))
    }
    const userInfoRes = await getUserInfo()
    if (userInfoRes.data) {
      dispatch(setUserInfo(userInfoRes.data))
      router.push(`/`, { scroll: false })
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={submitForm}>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-5 dark:text-white">
          <Input
            label={t('label_username')}
            name="username"
            placeholder={t('placeholder_username')}
            icon={<IconMail fill={true} />}
          />
          <PasswordInput
            label={t('label_password')}
            name="password"
            placeholder={t('placeholder_password')}
            icon={<IconLockDots fill={true} />}
          />

          <div className="text-right">
            <Link
              href="/forget-password"
              className="text-sm text-primary hover:underline dark:text-white"
            >
              {t('link_forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            isLoading={isLogin || isLoadingUserInfo}
          >
            {t('button_signin')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SigninForm;
