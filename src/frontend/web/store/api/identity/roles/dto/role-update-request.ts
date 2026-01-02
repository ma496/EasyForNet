import { BaseDto } from '@/store/api/base/dto/base-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'

export interface RoleUpdateRequest extends BaseDto<string>, RequestBase {
  name: string
  description?: string
}
