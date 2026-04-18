import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { UpdateProfile } from './_components/update-profile'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.profile.title,
  }
}

interface ProfilePageProps {
  params: Promise<{ lang: string }>
}

const Profile = async ({ params }: ProfilePageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent
      title={dict.page.profile.title}
      innerClassName='max-w-[620]'
    >
      <UpdateProfile />
    </AdminPageContent>
  )
}

export default Profile
