import { BaseDto } from "@/store/api/base/dto/base-dto"

export type UserUpdateResponse = BaseDto<string> & {
  username: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
