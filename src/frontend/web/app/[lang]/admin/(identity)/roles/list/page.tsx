import { getServerTranslation } from '@/i18n'
import { RoleTable } from './_components/role-table'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface RolesProps {
  params: Promise<{ lang: string }>
}

const Roles = async ({ params }: RolesProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.roles.title')
  return (
    <AdminPageContent title={title}>
      <RoleTable />
    </AdminPageContent>
  )
}

export default Roles
