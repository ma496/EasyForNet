import { BaseDto } from '@/store/api/base/dto/base-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'

export interface UserUpdateRequest extends BaseDto<string>, RequestBase {
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
