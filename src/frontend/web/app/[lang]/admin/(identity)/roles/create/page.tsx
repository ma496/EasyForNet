import { getServerTranslation } from '@/i18n'
import { RoleCreateForm } from './_components/role-create-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface RoleCreatePageProps {
  params: Promise<{ lang: string }>
}

const RoleCreate = async ({ params }: RoleCreatePageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.roles.create.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-155'
    >
      <RoleCreateForm />
    </AdminPageContent>
  )
}

export default RoleCreate
