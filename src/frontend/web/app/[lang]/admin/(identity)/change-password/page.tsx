import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { ChangePasswordForm } from './_components/change-password-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.changePassword.title,
  }
}

interface ChangePasswordPageProps {
  params: Promise<{ lang: string }>
}

const ChangePassword = async ({ params }: ChangePasswordPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent
      title={dict.page.changePassword.title}
      innerClassName='max-w-[620]'
    >
      <ChangePasswordForm />
    </AdminPageContent>
  )
}

export default ChangePassword
