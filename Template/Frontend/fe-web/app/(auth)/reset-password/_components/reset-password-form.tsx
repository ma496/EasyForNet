'use client'
import * as Yup from 'yup';
import { getTranslation } from '@/i18n';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPasswordMutation } from '@/store/api/account/account-api';
import Swal from 'sweetalert2';
import { Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import IconLockDots from '@/components/icon/icon-lock-dots';

const createValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    password: Yup.string()
      .required(t('validation_passwordRequired'))
      .min(8, t('validation_passwordMin'))
      .max(50, t('validation_passwordMax')),
    confirmPassword: Yup.string()
      .required(t('validation_confirmPasswordRequired'))
      .oneOf([Yup.ref('password')], t('validation_passwordsMustMatch')),
  });
};

export const ResetPasswordForm = () => {
  const { t } = getTranslation();
  const validationSchema = createValidationSchema(t);
  type ResetPasswordFormValues = Yup.InferType<typeof validationSchema>
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      Swal.fire({
        title: t('error'),
        text: t('invalid_or_expired_token'),
        icon: 'error',
      });
      return;
    }

    const result = await resetPassword({
      token,
      password: data.password,
    });

    if (!result.error) {
      Swal.fire({
        title: t('reset_password_success'),
        text: t('password_has_been_reset'),
        icon: 'success',
      });
      router.push('signin');
    }
  };

  return (
    <div className='panel flex flex-col gap-4 min-w-[300px] sm:min-w-[500px]'>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form noValidate className='flex flex-col gap-4'>
            <PasswordInput
              name='password'
              label={t('label_new_password')}
              placeholder={t('placeholder_new_password')}
              icon={<IconLockDots fill={true} />}
            />
            <PasswordInput
              name='confirmPassword'
              label={t('label_confirm_password')}
              placeholder={t('placeholder_confirm_password')}
              icon={<IconLockDots fill={true} />}
            />
            <div className='flex justify-end'>
              <Button type='submit' isLoading={isLoading}>
                {t('reset_password')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
