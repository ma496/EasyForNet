import { getServerTranslation } from '@/i18n'
import { RoleUpdateForm } from './_components/role-update-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface RoleUpdatePageProps {
  params: Promise<{
    lang: string
    id: string
  }>
}

const RoleUpdate = async ({ params }: RoleUpdatePageProps) => {
  const { lang, id } = await params
  const title = await getServerTranslation(lang, 'page.roles.update.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-[620]'
    >
      <RoleUpdateForm roleId={id} />
    </AdminPageContent>
  )
}

export default RoleUpdate
