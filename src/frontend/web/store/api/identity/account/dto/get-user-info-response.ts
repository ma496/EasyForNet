export type GetUserInfoResponse = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  image?: string
  roles: GetUserInfoRole[]
}

export type GetUserInfoRole = {
  id: string
  name: string
  permissions: GetUserInfoPermission[]
}

export type GetUserInfoPermission = {
  id: string
  name: string
  displayName: string
}
