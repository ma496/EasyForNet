import { RequestBase } from "@/store/api/base/dto/request-base"

export type UserCreateRequest = RequestBase & {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
