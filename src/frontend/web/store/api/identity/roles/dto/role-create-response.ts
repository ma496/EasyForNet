import { BaseDto } from '@/store/api/base/dto/base-dto'

export interface RoleCreateResponse extends BaseDto<string> {
  name: string
  nameNormalized: string
  description?: string
}
