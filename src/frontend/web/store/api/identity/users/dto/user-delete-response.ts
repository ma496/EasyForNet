import { BaseDto } from '@/store/api/base/dto/base-dto'

export interface UserDeleteResponse extends BaseDto<string> {
  success: boolean
  message: string
}
