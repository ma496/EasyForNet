import { BaseDto } from '@/store/api/base/dto/base-dto'

export interface UserUpdateResponse extends BaseDto<string> {
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
