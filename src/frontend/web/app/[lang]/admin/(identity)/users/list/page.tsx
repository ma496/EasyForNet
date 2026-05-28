import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { UserTable } from './_components/user-table'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.users.list.title'),
  }
}

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
