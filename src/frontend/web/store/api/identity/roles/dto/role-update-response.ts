import { BaseDto } from '@/store/api/base/dto/base-dto'

export interface RoleUpdateResponse extends BaseDto<string> {
  name: string
  nameNormalized: string
  description?: string
}
