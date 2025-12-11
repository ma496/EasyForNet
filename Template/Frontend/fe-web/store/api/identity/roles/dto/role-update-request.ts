import { BaseDto } from '@/store/api/base/dto/base-dto'

export type RoleUpdateRequest = BaseDto<string> & {
  name: string
  description?: string
}
