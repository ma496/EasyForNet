'use client'
import * as Yup from 'yup';
import { getTranslation } from '@/i18n';
import { useRouter } from 'next/navigation';
import { useRoleCreateMutation } from '@/store/api/identity/roles/roles-api';
import Swal from 'sweetalert2';
import { Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';

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

export const RoleCreateForm = () => {
  const { t } = getTranslation();
  const validationSchema = createValidationSchema(t);
  const [createRole, { isLoading }] = useRoleCreateMutation();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    const result = await createRole({
      name: data.name,
      description: data.description || '',
    });

    if (!result.error) {
      await Swal.fire({
        title: t('role_create_success'),
        icon: 'success',
      });
      router.push('/roles/list');
    }
  };

  return (
    <div className='panel flex flex-col gap-4 min-w-[300px] sm:min-w-[500px]'>
      <Formik<FormValues>
        initialValues={{
          name: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form noValidate className='flex flex-col gap-4'>
            <FormInput
              name='name'
              label={t('label_roleName')}
              placeholder={t('placeholder_roleName')}
            />
            <FormTextarea
              name='description'
              label={t('label_roleDescription')}
              placeholder={t('placeholder_roleDescription')}
              rows={4}
            />
            <div className='flex justify-end'>
              <Button type='submit' isLoading={isLoading}>
                {t('create_role')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
