import { Locale } from '@/i18n'
import { getDictionary } from '@/get-dictionary'
import { Metadata } from 'next'
import { UserTable } from './_components/user-table'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.users.list.title,
  }
}

const Users = () => {
  return <UserTable />
}

export default Users
