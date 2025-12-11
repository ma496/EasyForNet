import { Metadata } from 'next'
import { RoleTable } from './_components/role-table'

export const metadata: Metadata = {
  title: 'Roles',
}

const Roles = () => {
  return <RoleTable />
}

export default Roles
