'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useUserUpdateMutation } from '@/store/api/identity/users/users-api'
import { useUserGetQuery } from '@/store/api/identity/users/users-api'
import { useLazyRoleListQuery } from '@/store/api/identity/roles/roles-api'
import { RoleListRequest } from '@/store/api/identity/roles/dto/role-list-request'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/form-input'
import { FormCheckbox } from '@/components/ui/form/form-checkbox'
import { RoleListDto } from '@/store/api/identity/roles/dto/role-list-response'
import { FormLazyMultiSelect } from '@/components/ui/form/form-lazy-multi-select'
import { useEffect } from 'react'
import { successAlert } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: any) => string) => {
  return Yup.object().shape({
    firstName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    lastName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    isActive: Yup.boolean()
      .required(),
    roles: Yup.array().of(Yup.string())
      .required(t('validation_required')),
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
  const [fetchRoleList, { data: roleListData, isLoading: isLoadingRoles }] = useLazyRoleListQuery()
  const [updateUser, { isLoading: isUserSaving }] = useUserUpdateMutation()

  useEffect(() => {
    fetchRoleList({
      includeIds: userData?.roles,
    })
  }, [userData])

  if (isLoadingUser || isLoadingRoles) {
    return <div>{t('loading')}</div>
  }

  if (!userData) {
    return <div>{t('user_not_found')}</div>
  }

  const onSubmit = async (data: FormValues) => {
    const result = await updateUser({
      ...data,
      id: userId,
      roles: data.roles.filter((role): role is string => role !== undefined),
    })

    if (!result.error) {
      await successAlert({
        text: t('user_update_success'),
      })
      router.push('/app/users/list')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik<FormValues>
        initialValues={{
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          isActive: userData.isActive,
          roles: userData.roles,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form noValidate className="grid grid-cols-1 gap-4">
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
            <FormLazyMultiSelect<RoleListDto, RoleListRequest>
              name="roles"
              label={t('label_roles')}
              placeholder={t('placeholder_roles')}
              selectedItems={roleListData?.items}
              useLazyQuery={useLazyRoleListQuery}
              getLabel={(role) => role.name}
              getValue={(role) => role.id}
              size="sm"
              pageSize={20}
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
                isLoading={isUserSaving || isLoadingUser || isLoadingRoles}
              >
                {t('form_cancel')}
              </Button>
              <Button
                type="submit"
                isLoading={isUserSaving || isLoadingUser || isLoadingRoles}
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
