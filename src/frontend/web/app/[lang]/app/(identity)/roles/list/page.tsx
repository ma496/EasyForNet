import { Locale } from '@/i18n'
import { getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { RoleTable } from './_components/role-table'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.roles.list.title,
  }
}

const Roles = () => {
  return <RoleTable />
}

export default Roles
