import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { RoleUpdateForm } from './_components/role-update-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.roles.update.title'),
  }
}

interface RoleUpdatePageProps {
  params: Promise<{
    lang: string
    id: string
  }>
}

const RoleUpdate = async ({ params }: RoleUpdatePageProps) => {
  const { lang, id } = await params
  const title = await getServerTranslation(lang, 'page.roles.update.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-[620]'
    >
      <RoleUpdateForm roleId={id} />
    </AdminPageContent>
  )
}

export default RoleUpdate
