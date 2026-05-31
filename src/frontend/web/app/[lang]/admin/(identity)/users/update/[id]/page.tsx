import { getServerTranslation } from '@/i18n'
import { UserUpdateForm } from './_components/user-update-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

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
