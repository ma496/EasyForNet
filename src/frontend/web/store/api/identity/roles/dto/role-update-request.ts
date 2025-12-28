import { BaseDto } from '@/store/api/base/dto/base-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'

export type RoleUpdateRequest = BaseDto<string> & RequestBase & {
  name: string
  description?: string
}
