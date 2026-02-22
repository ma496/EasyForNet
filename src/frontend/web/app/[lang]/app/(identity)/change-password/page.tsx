import { Locale } from '@/i18n'
import { getDictionary } from '@/get-dictionary'
import { Metadata } from 'next'
import { ChangePasswordForm } from './_components/change-password-form'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.changePassword.title,
  }
}

const ChangePassword = () => {
  return (
    <div className="flex items-center justify-center">
      <ChangePasswordForm />
    </div>
  )
}

export default ChangePassword
