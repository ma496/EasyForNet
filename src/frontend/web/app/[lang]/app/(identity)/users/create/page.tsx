import { Locale } from '@/i18n'
import { getDictionary } from '@/i18n'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.users.create.title,
  }
}
import { Metadata } from 'next'
import { UserCreateForm } from './_components/user-create-form'



const UserCreate = () => {
  return (
    <div className="flex items-center justify-center">
      <UserCreateForm />
    </div>
  )
}

export default UserCreate
