'use client'
import * as Yup from 'yup';
import { getTranslation } from '@/i18n';
import { useRouter } from 'next/navigation';
import { useChangePasswordMutation } from '@/store/api/account/account-api';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import Swal from 'sweetalert2';
import { Form, Formik } from 'formik';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import IconLockDots from '@/components/icon/icon-lock-dots';

const createValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    currentPassword: Yup.string().required(t('validation_currentPasswordRequired')),
    newPassword: Yup.string().required(t('validation_newPasswordRequired')),
    confirmPassword: Yup.string()
      .required(t('validation_confirmPasswordRequired'))
      .oneOf([Yup.ref('newPassword')], t('validation_passwordsMustMatch')),
  });
};

export const ChangePasswordForm = () => {
  const { t } = getTranslation();
  const validationSchema = createValidationSchema(t);
  type ChangePasswordFormValues = Yup.InferType<typeof validationSchema>
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    if (!result.error) {
      Swal.fire({
        title: t('change_password_success'),
        icon: 'success',
      })
      dispatch(logout())
      router.push('signin');
    }
  };

  return (
    <div className='panel flex flex-col gap-4 min-w-[300px] sm:min-w-[500px]'>
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form noValidate className='flex flex-col gap-4'>
            <PasswordInput
              name='currentPassword'
              label={t('label_currentPassword')}
              placeholder={t('placeholder_currentPassword')}
              icon={<IconLockDots fill={true} />}
            />
            <PasswordInput
              name='newPassword'
              label={t('label_newPassword')}
              placeholder={t('placeholder_newPassword')}
              icon={<IconLockDots fill={true} />}
            />
            <PasswordInput
              name='confirmPassword'
              label={t('label_confirmPassword')}
              placeholder={t('placeholder_confirmPassword')}
              icon={<IconLockDots fill={true} />}
            />
            <div className='flex justify-end'>
              <Button type='submit' isLoading={isLoading}>
                {t('change_password')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
