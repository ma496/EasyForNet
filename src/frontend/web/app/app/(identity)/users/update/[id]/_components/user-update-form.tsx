'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useUserUpdateMutation } from '@/store/api/identity/users/users-api'
import { useUserGetQuery } from '@/store/api/identity/users/users-api'
import { useLazyRoleListQuery } from '@/store/api/identity/roles/roles-api'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/form-input'
import { FormCheckbox } from '@/components/ui/form/form-checkbox'
import { FormLazyMultiSelect } from '@/components/ui/form/form-lazy-multi-select'
import { successToast } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return Yup.object().shape({
    username: Yup.string(),
    firstName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    lastName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    isActive: Yup.boolean()
      .required(),
    roles: Yup.array().of(Yup.string())
      .required(t('validation_required'))
      .min(1, t('validation_atLeastOneSelected')),
  })
}

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>

interface UserUpdateFormProps {
  userId: string
}

export const UserUpdateForm = ({ userId }: UserUpdateFormProps) => {
  const { t } = getTranslation()
  const router = useRouter()
  const validationSchema = createValidationSchema(t)
  const { data: userData, isLoading: isLoadingUser } = useUserGetQuery({ id: userId })
  const [updateUser, { isLoading: isUserSaving }] = useUserUpdateMutation()

  if (isLoadingUser) {
    return <div>{t('loading')}</div>
  }

  if (!userData) {
    return <div>{t('user_not_found')}</div>
  }

  const onSubmit = async (data: FormValues) => {
    const { username: _username, ...updateData } = data
    const result = await updateUser({
      ...updateData,
      id: userId,
      roles: data.roles.filter((role): role is string => role !== undefined),
    })

    if (!result.error) {
      successToast.fire({
        title: t('user_update_success'),
      })
      router.push('/app/users/list')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik<FormValues>
        initialValues={{
          username: userData.username,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          isActive: userData.isActive,
          roles: userData.roles,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form noValidate className="grid grid-cols-1 gap-4">
            <FormInput
              name="username"
              label={t('label_username')}
              placeholder={t('placeholder_username')}
              disabled={true}
            />
            <FormInput
              name="firstName"
              label={t('label_firstName')}
              placeholder={t('placeholder_firstName')}
              autoFocus={true}
            />
            <FormInput
              name="lastName"
              label={t('label_lastName')}
              placeholder={t('placeholder_lastName')}
            />
            <FormLazyMultiSelect
              name="roles"
              label={t('label_roles')}
              placeholder={t('placeholder_roles')}
              selectedItemIds={userData.roles}
              useLazyQuery={useLazyRoleListQuery}
              getLabel={(role) => role.name}
              getValue={(role) => role.id}
              size="sm"
              pageSize={20}
              required={true}
            />
            <FormCheckbox
              name="isActive"
              label={t('label_isActive')}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/app/users/list')}
                isLoading={isUserSaving || isLoadingUser}
              >
                {t('form_cancel')}
              </Button>
              <Button
                type="submit"
                isLoading={isUserSaving || isLoadingUser}
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
