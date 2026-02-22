import { Locale } from '@/i18n'
import { getDictionary } from '@/get-dictionary'
import { Metadata } from 'next'
import { ChangePermissionsForm } from './_components/change-permissions-form'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.roles.changePermissions.title,
  }
}

interface ChangePermissionsPageProps {
  params: Promise<{
    id: string
  }>
}

const ChangePermissions = async ({ params }: ChangePermissionsPageProps) => {
  const { id } = await params

  return (
    <div className="flex items-center justify-center">
      <ChangePermissionsForm roleId={id} />
    </div>
  )
}

export default ChangePermissions
