import { Locale } from '@/i18n'
import { getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { RoleUpdateForm } from './_components/role-update-form'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.roles.update.title,
  }
}

interface RoleUpdatePageProps {
  params: Promise<{
    id: string
  }>
}

const RoleUpdate = async ({ params }: RoleUpdatePageProps) => {
  const { id } = await params

  return (
    <div className="flex items-center justify-center">
      <RoleUpdateForm roleId={id} />
    </div>
  )
}

export default RoleUpdate
