import { Metadata } from 'next'
import { UserUpdateForm } from './_components/user-update-form'

export const metadata: Metadata = {
  title: 'Update User',
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
