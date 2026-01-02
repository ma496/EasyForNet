'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useUserCreateMutation } from '@/store/api/identity/users/users-api'
import { useLazyRoleListQuery } from '@/store/api/identity/roles/roles-api'
import { RoleListRequest } from '@/store/api/identity/roles/roles-dtos'
import { Form, Formik } from 'formik'
import { FormPasswordInput } from '@/components/ui/form/form-password-input'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/form-input'
import { FormCheckbox } from '@/components/ui/form/form-checkbox'
import { RoleListDto } from '@/store/api/identity/roles/roles-dtos'
import { FormLazyMultiSelect } from '@/components/ui/form/form-lazy-multi-select'
import { SuccessToast } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: any) => string) => {
  return Yup.object().shape({
    username: Yup.string()
      .required(t('validation_required'))
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    email: Yup.string()
      .required(t('validation_required'))
      .email(t('validation_invalidEmail')),
    firstName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    lastName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    password: Yup.string()
      .required(t('validation_required'))
      .min(8, t('validation_minLength', { min: 8 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    confirmPassword: Yup.string()
      .required(t('validation_required'))
      .oneOf([Yup.ref('password')], t('validation_mustMatch', { otherField: t('label_password') })),
    isActive: Yup.boolean().required(),
    roles: Yup.array().of(Yup.string())
      .required(t('validation_required'))
      .min(1, t('validation_atLeastOneSelected')),
  })
}

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>

export const UserCreateForm = () => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  const [createUser, { isLoading: isCreatingUser }] = useUserCreateMutation()
  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    const result = await createUser({
      ...data,
      roles: data.roles.filter((role): role is string => role !== undefined),
    })

    if (!result.error) {
      SuccessToast.fire({
        title: t('user_create_success'),
      })
      router.push('/app/users/list')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
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
          <Form noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              name="username"
              label={t('label_username')}
              placeholder={t('placeholder_username')}
              autoFocus={true}
              required={true}
            />
            <FormInput
              name="email"
              type="email"
              label={t('label_email')}
              placeholder={t('placeholder_email')}
              required={true}
            />
            <FormInput
              name="firstName"
              label={t('label_firstName')}
              placeholder={t('placeholder_firstName')}
            />
            <FormInput
              name="lastName"
              label={t('label_lastName')}
              placeholder={t('placeholder_lastName')}
            />
            <FormPasswordInput
              name="password"
              label={t('label_password')}
              placeholder={t('placeholder_password')}
              required={true}
            />
            <FormPasswordInput
              name="confirmPassword"
              label={t('label_confirmPassword')}
              placeholder={t('placeholder_confirmPassword')}
              required={true}
            />
            <div className="sm:col-span-2">
              <FormLazyMultiSelect<RoleListDto, RoleListRequest>
                name="roles"
                label={t('label_roles')}
                placeholder={t('placeholder_roles')}
                useLazyQuery={useLazyRoleListQuery}
                getLabel={(role) => role.name}
                getValue={(role) => role.id}
                size="sm"
                pageSize={20}
                required={true}
              />
            </div>
            <div className="sm:col-span-2">
              <FormCheckbox
                name="isActive"
                label={t('label_isActive')}
              />
            </div>
            <div className="flex justify-end gap-4 sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/app/users/list')}
                isLoading={isCreatingUser}
              >
                {t('form_cancel')}
              </Button>
              <Button
                type="submit"
                isLoading={isCreatingUser}
              >
                {t('form_submit')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
