'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
// import { useRouter } from 'next/navigation'
import { useLocalizedRouter } from '@/hooks/use-localized-router'
import { useRoleCreateMutation } from '@/store/api/identity/roles/roles-api'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/form-input'
import { FormTextarea } from '@/components/ui/form/form-textarea'
import { successToast } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validation.required'))
      .min(2, t('validation.minLength', { min: 2 }))
      .max(50, t('validation.maxLength', { max: 50 })),
    description: Yup.string()
      .min(10, t('validation.minLength', { min: 10 }))
      .max(255, t('validation.maxLength', { max: 255 })),
  })
}

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>

export const RoleCreateForm = () => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  const [createRole, { isLoading: isSavingRole }] = useRoleCreateMutation()
  const router = useLocalizedRouter()

  const onSubmit = async (data: FormValues) => {
    const result = await createRole({
      ...data,
    })
    if (result.data) {
      successToast.fire({
        title: t('page.roles.createSuccess'),
      })
      router.push('/app/roles/list')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik<FormValues>
        initialValues={{
          name: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form noValidate className="grid grid-cols-1 gap-4">
            <FormInput
              name="name"
              label={t('form.label.roleName')}
              placeholder={t('form.placeholder.roleName')}
              autoFocus={true}
              required={true}
            />
            <FormTextarea
              name="description"
              label={t('form.label.roleDescription')}
              placeholder={t('form.placeholder.roleDescription')}
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/app/roles/list')}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                isLoading={isSavingRole}
              >
                {t('common.submit')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
