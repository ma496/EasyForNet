import { BaseDto } from '@/store/api/base/dto/base-dto'

export interface RoleDeleteResponse extends BaseDto<string> {
  success: boolean
  message: string
}
