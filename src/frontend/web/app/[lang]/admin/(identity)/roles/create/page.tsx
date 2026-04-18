import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { RoleCreateForm } from './_components/role-create-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.roles.create.title,
  }
}

interface RoleCreatePageProps {
  params: Promise<{ lang: string }>
}

const RoleCreate = async ({ params }: RoleCreatePageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent
      title={dict.page.roles.create.title}
      innerClassName='max-w-[620]'
    >
      <RoleCreateForm />
    </AdminPageContent>
  )
}

export default RoleCreate
