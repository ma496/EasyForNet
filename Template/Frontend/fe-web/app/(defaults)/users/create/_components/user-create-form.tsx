'use client'
import * as Yup from 'yup';
import { getTranslation } from '@/i18n';
import { useRouter } from 'next/navigation';
import { useUserCreateMutation } from '@/store/api/users/users-api';
import Swal from 'sweetalert2';
import { Form, Formik } from 'formik';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import { Checkbox } from '@/components/ui/checkbox';

const createValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    username: Yup.string()
      .required(t('validation_usernameRequired'))
      .min(2, t('validation_usernameMin'))
      .max(50, t('validation_usernameMax')),
    email: Yup.string()
      .required(t('validation_emailRequired'))
      .email(t('validation_emailInvalid')),
    firstName: Yup.string()
      .min(2, t('validation_firstNameMin'))
      .max(50, t('validation_firstNameMax')),
    lastName: Yup.string()
      .min(2, t('validation_lastNameMin'))
      .max(50, t('validation_lastNameMax')),
    password: Yup.string()
      .required(t('validation_passwordRequired'))
      .min(8, t('validation_passwordMin'))
      .max(50, t('validation_passwordMax')),
    confirmPassword: Yup.string()
      .required(t('validation_confirmPasswordRequired'))
      .oneOf([Yup.ref('password')], t('validation_passwordsMustMatch')),
    isActive: Yup.boolean().required(),
  });
};

export const UserCreateForm = () => {
  const { t } = getTranslation();
  const validationSchema = createValidationSchema(t);
  type UserCreateFormValues = Yup.InferType<typeof validationSchema>
  const [createUser, { isLoading }] = useUserCreateMutation()
  const router = useRouter()

  const onSubmit = async (data: UserCreateFormValues) => {
    const result = await createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: data.isActive,
      roles: [],
    });

    if (!result.error) {
      await Swal.fire({
        title: t('user_create_success'),
        icon: 'success',
      })
      router.push('/users/list');
    }
  };

  return (
    <div className='panel flex flex-col gap-4 min-w-[300px] sm:min-w-[500px]'>
      <Formik
        initialValues={{
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
          isActive: true,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form noValidate className='flex flex-col gap-4'>
            <Input
              name='username'
              label={t('label_username')}
              placeholder={t('placeholder_username')}
              icon={<IconUser />}
            />
            <Input
              name='email'
              type='email'
              label={t('label_email')}
              placeholder={t('placeholder_email')}
              icon={<IconMail />}
            />
            <Input
              name='firstName'
              label={t('label_firstName')}
              placeholder={t('placeholder_firstName')}
              icon={<IconUser />}
            />
            <Input
              name='lastName'
              label={t('label_lastName')}
              placeholder={t('placeholder_lastName')}
              icon={<IconUser />}
            />
            <PasswordInput
              name='password'
              label={t('label_password')}
              placeholder={t('placeholder_password')}
              icon={<IconLockDots fill={true} />}
            />
            <PasswordInput
              name='confirmPassword'
              label={t('label_confirmPassword')}
              placeholder={t('placeholder_confirmPassword')}
              icon={<IconLockDots fill={true} />}
            />
            <Checkbox
              name='isActive'
              label={t('label_isActive')}
            />
            <div className='flex justify-end'>
              <Button type='submit' isLoading={isLoading}>
                {t('create_user')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
