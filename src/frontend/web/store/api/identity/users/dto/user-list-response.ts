import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'
import { BaseDto } from '@/store/api/base/dto/base-dto'
import { ListDto } from '../../../base/dto/list-dto'

export interface UserListResponse extends ListDto<UserListDto> { }

export interface UserListDto extends GenericAuditableDto<string> {
  username: string
  usernameNormalized: string
  email: string
  emailNormalized: string
  firstName: string
  lastName: string
  isActive: boolean
  roles: UserRoleDto[]
}

export interface UserRoleDto extends BaseDto<string> {
  name: string
}
