import { Metadata } from 'next'
import { UserCreateForm } from './_components/user-create-form'

export const metadata: Metadata = {
  title: 'Create User',
}

const UserCreate = () => {
  return (
    <div className="flex items-center justify-center">
      <UserCreateForm />
    </div>
  )
}

export default UserCreate
