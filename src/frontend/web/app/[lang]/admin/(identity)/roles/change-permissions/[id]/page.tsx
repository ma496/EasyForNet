import { getServerTranslation } from '@/i18n'
import { ChangePermissionsForm } from './_components/change-permissions-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface ChangePermissionsPageProps {
  params: Promise<{
    lang: string
    id: string
  }>
}

const ChangePermissions = async ({ params }: ChangePermissionsPageProps) => {
  const { lang, id } = await params
  const title = await getServerTranslation(lang, 'page.roles.changePermissions.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-175'
    >
      <ChangePermissionsForm roleId={id} />
    </AdminPageContent>
  )
}

export default ChangePermissions
