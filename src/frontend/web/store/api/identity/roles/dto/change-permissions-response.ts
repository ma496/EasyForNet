import { BaseDto } from '@/store/api/base/dto/base-dto'

export interface ChangePermissionsResponse extends BaseDto<string> {
  permissions: string[]
}
