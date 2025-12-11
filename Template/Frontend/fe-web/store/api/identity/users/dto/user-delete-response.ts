import { BaseDto } from '@/store/api/base/dto/base-dto'

export type UserDeleteResponse = BaseDto<string> & {
  success: boolean
  message: string
}
