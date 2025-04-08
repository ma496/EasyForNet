'use client'
import * as Yup from 'yup';
import { getTranslation } from '@/i18n';
import { useRouter } from 'next/navigation';
import { useRoleUpdateMutation, useRoleGetQuery } from '@/store/api/roles/roles-api';
import Swal from 'sweetalert2';
import { Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const createValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validation_roleNameRequired'))
      .min(2, t('validation_roleNameMin'))
      .max(50, t('validation_roleNameMax')),
    description: Yup.string()
      .optional()
      .min(10, t('validation_roleDescriptionMin'))
      .max(255, t('validation_roleDescriptionMax')),
  });
};

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>;

interface RoleUpdateFormProps {
  roleId: string;
}

export const RoleUpdateForm = ({ roleId }: RoleUpdateFormProps) => {
  const { t } = getTranslation();
  const validationSchema = createValidationSchema(t);
  const [updateRole, { isLoading }] = useRoleUpdateMutation();
  const { data: roleData, isLoading: isLoadingRole } = useRoleGetQuery({ id: roleId });
  const router = useRouter();

  if (isLoadingRole) {
    return <div>{t('loading')}</div>;
  }

  if (!roleData) {
    return <div>{t('role_not_found')}</div>;
  }

  const onSubmit = async (data: FormValues) => {
    const result = await updateRole({
      id: roleId,
      name: data.name,
      description: data.description || '',
    });

    if (!result.error) {
      await Swal.fire({
        title: t('role_update_success'),
        icon: 'success',
      });
      router.push('/roles/list');
    }
  };

  return (
    <div className='panel flex flex-col gap-4 min-w-[300px] sm:min-w-[500px]'>
      <Formik<FormValues>
        initialValues={{
          name: roleData.name,
          description: roleData.description || '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form noValidate className='flex flex-col gap-4'>
            <Input
              name='name'
              label={t('label_roleName')}
              placeholder={t('placeholder_roleName')}
            />
            <Textarea
              name='description'
              label={t('label_roleDescription')}
              placeholder={t('placeholder_roleDescription')}
              rows={4}
            />
            <div className='flex justify-end'>
              <Button type='submit' isLoading={isLoading}>
                {t('update_role')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
