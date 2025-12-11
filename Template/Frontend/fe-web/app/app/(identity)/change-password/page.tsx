import { Metadata } from 'next'
import { ChangePasswordForm } from './_components/change-password-form'

export const metadata: Metadata = {
  title: 'Change Password',
}

const ChangePassword = () => {
  return (
    <div className="flex items-center justify-center">
      <ChangePasswordForm />
    </div>
  )
}

export default ChangePassword
