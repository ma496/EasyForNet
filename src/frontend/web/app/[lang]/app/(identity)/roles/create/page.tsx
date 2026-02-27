import { Locale } from '@/i18n'
import { getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { RoleCreateForm } from './_components/role-create-form'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.roles.create.title,
  }
}

const RoleCreate = () => {
  return (
    <div className="flex items-center justify-center">
      <RoleCreateForm />
    </div>
  )
}

export default RoleCreate
