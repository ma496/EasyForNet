import { BaseDto } from '@/store/api/base/dto/base-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'
import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'
import { ListRequestDto } from '@/store/api/base/dto/list-request-dto'
import { ListDto } from '@/store/api/base/dto/list-dto'

export interface ChangePermissionsRequest extends BaseDto<string>, RequestBase {
  permissions: string[]
}

export interface ChangePermissionsResponse extends BaseDto<string> {
  permissions: string[]
}

export interface RoleCreateRequest extends RequestBase {
  name: string
  description?: string
}

export interface RoleCreateResponse extends BaseDto<string> {
  name: string
  nameNormalized: string
  description?: string
}

export interface RoleDeleteRequest extends BaseDto<string>, RequestBase { }

export interface RoleDeleteResponse extends BaseDto<string> {
  success: boolean
  message: string
}

export interface RoleGetRequest extends BaseDto<string>, RequestBase { }

export interface RoleGetResponse extends GenericAuditableDto<string> {
  name: string
  nameNormalized: string
  description: string
  permissions: string[]
  userCount: number
}

export interface RoleListRequest extends ListRequestDto<string>, RequestBase { }

export type RoleListResponse = ListDto<RoleListDto>

export interface RoleListDto extends GenericAuditableDto<string> {
  name: string
  nameNormalized: string
  description: string
  permissions: string[]
  userCount: number
}

export interface RoleUpdateRequest extends BaseDto<string>, RequestBase {
  name: string
  description?: string
}

export interface RoleUpdateResponse extends BaseDto<string> {
  name: string
  nameNormalized: string
  description?: string
}
