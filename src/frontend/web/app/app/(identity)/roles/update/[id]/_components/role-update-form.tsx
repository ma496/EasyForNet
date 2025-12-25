'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useRoleUpdateMutation, useRoleGetQuery } from '@/store/api/identity/roles/roles-api'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/form-input'
import { FormTextarea } from '@/components/ui/form/form-textarea'
import { SuccessToast } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: any) => string) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validation_required'))
      .min(2, t('validation_minLength', { count: 2 }))
      .max(50, t('validation_maxLength', { count: 50 })),
    description: Yup.string()
      .min(10, t('validation_minLength', { count: 10 }))
      .max(255, t('validation_maxLength', { count: 255 })),
  })
}

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>

interface RoleUpdateFormProps {
  roleId: string
}

export const RoleUpdateForm = ({ roleId }: RoleUpdateFormProps) => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  const [updateRole, { isLoading: isSavingRole }] = useRoleUpdateMutation()
  const { data: roleData, isLoading: isLoadingRole } = useRoleGetQuery({ id: roleId })
  const router = useRouter()

  if (isLoadingRole) {
    return <div>{t('loading')}</div>
  }

  if (!roleData) {
    return <div>{t('role_not_found')}</div>
  }

  const onSubmit = async (data: FormValues) => {
    const result = await updateRole({
      ...data,
      id: roleId,
    })

    if (!result.error) {
      SuccessToast.fire({
        title: t('role_update_success'),
      })
      router.push('/app/roles/list')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik<FormValues>
        initialValues={{
          name: roleData.name,
          description: roleData.description || '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form noValidate className="grid grid-cols-1 gap-4">
            <FormInput
              name="name"
              label={t('label_roleName')}
              placeholder={t('placeholder_roleName')}
              autoFocus={true}
              required={true}
            />
            <FormTextarea
              name="description"
              label={t('label_roleDescription')}
              placeholder={t('placeholder_roleDescription')}
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/app/roles/list')}
              >
                {t('form_cancel')}
              </Button>
              <Button
                type="submit"
                isLoading={isSavingRole}
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
