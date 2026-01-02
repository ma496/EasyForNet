import { BaseDto } from '@/store/api/base/dto/base-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'

export interface ChangePermissionsRequest extends BaseDto<string>, RequestBase {
  permissions: string[]
}
