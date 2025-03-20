import { BaseDto } from "@/store/api/base/dto/base-dto"

export type UserUpdateRequest = BaseDto<string> & {
  username: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
