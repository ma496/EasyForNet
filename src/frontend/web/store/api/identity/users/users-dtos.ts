import { BaseDto } from '@/store/api/base/dto/base-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'
import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'
import { ListRequestDto } from '@/store/api/base/dto/list-request-dto'
import { ListDto } from '@/store/api/base/dto/list-dto'

export interface UserCreateRequest extends RequestBase {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}

export interface UserCreateResponse extends BaseDto<string> {
  username: string
  usernameNormalized: string
  email: string
  emailNormalized: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}

export interface UserDeleteRequest extends BaseDto<string>, RequestBase { }

export interface UserDeleteResponse extends BaseDto<string> {
  success: boolean
  message: string
}

export interface UserGetRequest extends BaseDto<string>, RequestBase { }

export interface UserGetResponse extends GenericAuditableDto<string> {
  username: string
  usernameNormalized: string
  email: string
  emailNormalized: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}

export interface UserListRequest extends ListRequestDto<string>, RequestBase {
  isActive?: boolean
  roleId?: string
}

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

export interface UserUpdateRequest extends BaseDto<string>, RequestBase {
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}

export interface UserUpdateResponse extends BaseDto<string> {
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
