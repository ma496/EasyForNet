'use client'
import * as Yup from 'yup';
import { getTranslation } from '@/i18n';
import { useRouter } from 'next/navigation';
import { useUserUpdateMutation } from '@/store/api/users/users-api';
import { useUserGetQuery } from '@/store/api/users/users-api';
import { useRoleListQuery } from '@/store/api/roles/roles-api';
import { RoleListRequest } from '@/store/api/roles/dto/role-list-request';
import Swal from 'sweetalert2';
import { Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import { Checkbox } from '@/components/ui/checkbox';
import Select, { MultiValue } from 'react-select';
import { RoleListDto } from '@/store/api/roles/dto/role-list-response';

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
    isActive: Yup.boolean().required(),
    roles: Yup.array().of(Yup.string()).required(t('validation_rolesRequired')),
  });
};

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>;

interface UserUpdateFormProps {
  userId: string;
}

export const UserUpdateForm = ({ userId }: UserUpdateFormProps) => {
  const { t } = getTranslation();
  const validationSchema = createValidationSchema(t);
  const [updateUser, { isLoading }] = useUserUpdateMutation();
  const { data: userData, isLoading: isLoadingUser } = useUserGetQuery({ id: userId });
  const { data: rolesData, isLoading: isLoadingRoles } = useRoleListQuery({
    page: 1,
    pageSize: 100,
    all: true,
  } as RoleListRequest);
  const router = useRouter();

  const roleOptions = rolesData?.items.map((role: RoleListDto) => ({
    value: role.id,
    label: role.name,
  })) || [];

  if (isLoadingUser) {
    return <div>{t('loading')}</div>;
  }

  if (!userData) {
    return <div>{t('user_not_found')}</div>;
  }

  const onSubmit = async (data: FormValues) => {
    const result = await updateUser({
      id: userId,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: data.isActive,
      roles: data.roles.filter((role): role is string => role !== undefined),
    });

    if (!result.error) {
      await Swal.fire({
        title: t('user_update_success'),
        icon: 'success',
      });
      router.push('/users/list');
    }
  };

  return (
    <div className='panel flex flex-col gap-4 min-w-[300px] sm:min-w-[500px]'>
      <Formik<FormValues>
        initialValues={{
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          isActive: userData.isActive,
          roles: userData.roles,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
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
            <div className="flex flex-col gap-1 custom-select">
              <label className="text-sm font-medium">{t('label_roles')}</label>
              <Select<{ value: string; label: string }, true>
                placeholder={t('placeholder_roles')}
                isMulti
                isLoading={isLoadingRoles}
                options={roleOptions}
                value={roleOptions.filter(option =>
                  Array.isArray(values.roles) && values.roles.includes(option.value)
                )}
                onChange={(newValue: MultiValue<{ value: string; label: string }>) => {
                  setFieldValue(
                    'roles',
                    newValue ? newValue.map(option => option.value) : []
                  );
                }}
              />
              {touched.roles && errors.roles && (
                <span className="text-danger text-xs mt-1">{errors.roles as string}</span>
              )}
            </div>
            <Checkbox
              name='isActive'
              label={t('label_isActive')}
            />
            <div className='flex justify-end'>
              <Button type='submit' isLoading={isLoading}>
                {t('update_user')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
