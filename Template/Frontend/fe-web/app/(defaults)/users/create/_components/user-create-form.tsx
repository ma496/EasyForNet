'use client'
import * as Yup from 'yup';
import { getTranslation } from '@/i18n';
import { useRouter } from 'next/navigation';
import { useUserCreateMutation } from '@/store/api/users/users-api';
import { useRoleListQuery } from '@/store/api/roles/roles-api';
import { RoleListRequest } from '@/store/api/roles/dto/role-list-request';
import Swal from 'sweetalert2';
import { Form, Formik } from 'formik';
import { FormPasswordInput } from '@/components/ui/form-password-input';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import { FormCheckbox } from '@/components/ui/form-checkbox';
import { RoleListDto } from '@/store/api/roles/dto/role-list-response';
import { FormMultiSelect } from '@/components/ui/form-multi-select';

const createValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    username: Yup.string()
      .required(t('validation_usernameRequired'))
      .min(2, t('validation_usernameMin'))
      .max(50, t('validation_usernameMax')),
    email: Yup.string()
      .required(t('validation_emailRequired'))
      .email(t('validation_invalidEmail')),
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
    roles: Yup.array().of(Yup.string()).required(t('validation_rolesRequired')),
  });
};

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>;

export const UserCreateForm = () => {
  const { t } = getTranslation();
  const validationSchema = createValidationSchema(t);
  const [createUser, { isLoading }] = useUserCreateMutation()
  const { data: rolesData, isLoading: isLoadingRoles } = useRoleListQuery({
    page: 1,
    pageSize: 100,
    all: true,
  } as RoleListRequest);
  const router = useRouter()

  const roleOptions = rolesData?.items.map((role: RoleListDto) => ({
    value: role.id,
    label: role.name,
  })) || [];

  const onSubmit = async (data: FormValues) => {
    const result = await createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: data.isActive,
      roles: data.roles.filter((role): role is string => role !== undefined),
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
      <Formik<FormValues>
        initialValues={{
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
          isActive: true,
          roles: [],
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form noValidate className='flex flex-col gap-4'>
            <FormInput
              name='username'
              label={t('label_username')}
              placeholder={t('placeholder_username')}
              icon={<IconUser />}
            />
            <FormInput
              name='email'
              type='email'
              label={t('label_email')}
              placeholder={t('placeholder_email')}
              icon={<IconMail />}
            />
            <FormInput
              name='firstName'
              label={t('label_firstName')}
              placeholder={t('placeholder_firstName')}
              icon={<IconUser />}
            />
            <FormInput
              name='lastName'
              label={t('label_lastName')}
              placeholder={t('placeholder_lastName')}
              icon={<IconUser />}
            />
            <FormPasswordInput
              name='password'
              label={t('label_password')}
              placeholder={t('placeholder_password')}
              icon={<IconLockDots fill={true} />}
            />
            <FormPasswordInput
              name='confirmPassword'
              label={t('label_confirmPassword')}
              placeholder={t('placeholder_confirmPassword')}
              icon={<IconLockDots fill={true} />}
            />
            <FormMultiSelect
              name='roles'
              label={t('label_roles')}
              placeholder={t('placeholder_roles')}
              options={roleOptions}
              size='sm'
            />
            <FormCheckbox
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
