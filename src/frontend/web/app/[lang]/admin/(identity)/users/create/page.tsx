import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { UserCreateForm } from './_components/user-create-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.users.create.title'),
  }
}

interface UserCreatePageProps {
  params: Promise<{ lang: string }>
}

const UserCreate = async ({ params }: UserCreatePageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.users.create.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-[750]'
    >
      <UserCreateForm />
    </AdminPageContent>
  )
}

export default UserCreate
