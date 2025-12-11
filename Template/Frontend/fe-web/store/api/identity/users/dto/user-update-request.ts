import { BaseDto } from '@/store/api/base/dto/base-dto'

export type UserUpdateRequest = BaseDto<string> & {
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
