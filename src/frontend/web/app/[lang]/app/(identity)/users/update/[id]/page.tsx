import { Locale } from '@/i18n'
import { getDictionary } from '@/get-dictionary'
import { Metadata } from 'next'
import { UserUpdateForm } from './_components/user-update-form'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.users.update.title,
  }
}

interface UserUpdatePageProps {
  params: Promise<{
    id: string
  }>
}

const UserUpdate = async ({ params }: UserUpdatePageProps) => {
  const { id } = await params

  return (
    <div className="flex items-center justify-center">
      <UserUpdateForm userId={id} />
    </div>
  )
}

export default UserUpdate
