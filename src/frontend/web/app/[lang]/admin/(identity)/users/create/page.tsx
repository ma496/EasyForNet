import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { UserCreateForm } from './_components/user-create-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.users.create.title,
  }
}

interface UserCreatePageProps {
  params: Promise<{ lang: string }>
}

const UserCreate = async ({ params }: UserCreatePageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent
      title={dict.page.users.create.title}
      innerClassName='max-w-[750]'
    >
      <UserCreateForm />
    </AdminPageContent>
  )
}

export default UserCreate
