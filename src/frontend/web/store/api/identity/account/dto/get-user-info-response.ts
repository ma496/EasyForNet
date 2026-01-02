export interface GetUserInfoResponse {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  image?: string
  roles: GetUserInfoRole[]
}

export interface GetUserInfoRole {
  id: string
  name: string
  permissions: GetUserInfoPermission[]
}

export interface GetUserInfoPermission {
  id: string
  name: string
  displayName: string
}
