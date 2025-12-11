import { Metadata } from 'next'
import { RoleCreateForm } from './_components/role-create-form'

export const metadata: Metadata = {
  title: 'Create Role',
}

const RoleCreate = () => {
  return (
    <div className="flex items-center justify-center">
      <RoleCreateForm />
    </div>
  )
}

export default RoleCreate
