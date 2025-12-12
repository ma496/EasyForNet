import { Metadata } from 'next'
import { UpdateProfile } from './_components/update-profile'

export const metadata: Metadata = {
  title: 'Profile',
}

const Profile = () => {
  return (
    <div className="flex items-center justify-center">
      <UpdateProfile />
    </div>
  )
}

export default Profile
