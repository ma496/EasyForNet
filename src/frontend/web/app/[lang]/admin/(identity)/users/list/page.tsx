import { getServerTranslation } from '@/i18n'
import { UserTable } from './_components/user-table'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface UsersProps {
  params: Promise<{ lang: string }>
}

const Users = async ({ params }: UsersProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.users.title')
  return (
    <AdminPageContent title={title}>
      <UserTable />
    </AdminPageContent>
  )
}

export default Users
