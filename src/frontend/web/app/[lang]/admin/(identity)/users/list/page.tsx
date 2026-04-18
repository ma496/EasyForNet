import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { UserTable } from './_components/user-table'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.users.list.title,
  }
}

interface UsersProps {
  params: Promise<{ lang: string }>
}

const Users = async ({ params }: UsersProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return (
    <AdminPageContent title={dict.page.users.title}>
      <UserTable />
    </AdminPageContent>
  )
}

export default Users
