import { Metadata } from 'next'
import { RoleUpdateForm } from './_components/role-update-form'

export const metadata: Metadata = {
  title: 'Update Role',
}

interface RoleUpdatePageProps {
  params: Promise<{
    id: string
  }>
}

const RoleUpdate = async ({ params }: RoleUpdatePageProps) => {
  const { id } = await params

  return (
    <div className="flex items-center justify-center">
      <RoleUpdateForm roleId={id} />
    </div>
  )
}

export default RoleUpdate
