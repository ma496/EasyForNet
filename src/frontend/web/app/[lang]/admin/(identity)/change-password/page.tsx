import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { ChangePasswordForm } from './_components/change-password-form'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.changePassword.title'),
  }
}

interface ChangePasswordPageProps {
  params: Promise<{ lang: string }>
}

const ChangePassword = async ({ params }: ChangePasswordPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.changePassword.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-[620]'
    >
      <ChangePasswordForm />
    </AdminPageContent>
  )
}

export default ChangePassword
