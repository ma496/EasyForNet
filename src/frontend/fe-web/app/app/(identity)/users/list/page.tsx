import { Metadata } from 'next'
import { UserTable } from './_components/user-table'

export const metadata: Metadata = {
  title: 'Users',
}

const Users = () => {
  return <UserTable />
}

export default Users
