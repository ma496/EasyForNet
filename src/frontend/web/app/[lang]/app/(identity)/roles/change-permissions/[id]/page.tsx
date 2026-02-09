import { Metadata } from 'next'
import { ChangePermissionsForm } from './_components/change-permissions-form'

export const metadata: Metadata = {
  title: 'Change Permissions',
}

interface ChangePermissionsPageProps {
  params: Promise<{
    id: string
  }>
}

const ChangePermissions = async ({ params }: ChangePermissionsPageProps) => {
  const { id } = await params

  return (
    <div className="flex items-center justify-center">
      <ChangePermissionsForm roleId={id} />
    </div>
  )
}

export default ChangePermissions
