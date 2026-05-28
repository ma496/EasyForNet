import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { UpdateProfile } from './_components/update-profile'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.profile.title'),
  }
}

interface ProfilePageProps {
  params: Promise<{ lang: string }>
}

const Profile = async ({ params }: ProfilePageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.profile.title')

  return (
    <AdminPageContent
      title={title}
      innerClassName='max-w-[620]'
    >
      <UpdateProfile />
    </AdminPageContent>
  )
}

export default Profile
