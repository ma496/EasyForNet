import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { RoleTable } from './_components/role-table'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.roles.list.title'),
  }
}

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
