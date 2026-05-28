import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { UserUpdateForm } from './_components/user-update-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.users.update.title'),
  }
}

interface UserUpdatePageProps {
  params: Promise<{
    lang: string
    id: string
  }>
}

const UserUpdate = async ({ params }: UserUpdatePageProps) => {
  const { lang, id } = await params
  const title = await getServerTranslation(lang, 'page.users.update.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-[620]'
    >
      <UserUpdateForm userId={id} />
    </AdminPageContent>
  )
}

export default UserUpdate
