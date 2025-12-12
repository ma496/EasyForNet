export type UserCreateRequest = {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
