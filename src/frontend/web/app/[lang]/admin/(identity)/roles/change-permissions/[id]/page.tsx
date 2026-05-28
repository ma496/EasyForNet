import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { ChangePermissionsForm } from './_components/change-permissions-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.roles.changePermissions.title'),
  }
}

interface ChangePermissionsPageProps {
  params: Promise<{
    lang: string
    id: string
  }>
}

const ChangePermissions = async ({ params }: ChangePermissionsPageProps) => {
  const { lang, id } = await params
  const title = await getServerTranslation(lang, 'page.roles.changePermissions.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-[700]'
    >
      <ChangePermissionsForm roleId={id} />
    </AdminPageContent>
  )
}

export default ChangePermissions
