import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { RoleTable } from './_components/role-table'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.roles.list.title,
  }
}

interface RolesProps {
  params: Promise<{ lang: string }>
}

const Roles = async ({ params }: RolesProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return (
    <AdminPageContent title={dict.page.roles.title}>
      <RoleTable />
    </AdminPageContent>
  )
}

export default Roles
