import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { RoleCreateForm } from './_components/role-create-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.roles.create.title'),
  }
}

interface RoleCreatePageProps {
  params: Promise<{ lang: string }>
}

const RoleCreate = async ({ params }: RoleCreatePageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.roles.create.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-[620]'
    >
      <RoleCreateForm />
    </AdminPageContent>
  )
}

export default RoleCreate
