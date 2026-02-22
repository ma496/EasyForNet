import { Locale } from '@/i18n'
import { getDictionary } from '@/get-dictionary'
import { Metadata } from 'next'
import { UpdateProfile } from './_components/update-profile'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.profile.title,
  }
}

const Profile = () => {
  return (
    <div className="flex items-center justify-center">
      <UpdateProfile />
    </div>
  )
}

export default Profile
