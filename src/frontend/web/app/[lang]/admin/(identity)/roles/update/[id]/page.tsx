import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { RoleUpdateForm } from './_components/role-update-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.roles.update.title,
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
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent
      title={dict.page.roles.update.title}
      innerClassName='max-w-[620]'
    >
      <RoleUpdateForm roleId={id} />
    </AdminPageContent>
  )
}

export default RoleUpdate
