import { AuditableDto } from "@/store/api/base/dto/auditable-dto"
import { BaseDto } from "@/store/api/base/dto/base-dto"
import { ListDto } from "../../base/dto/list-dto"

export type UserListResponse = ListDto<UserListDto>

export type UserListDto = BaseDto<string> & AuditableDto & {
  username: string
  usernameNormalized: string
  email: string
  emailNormalized: string
  firstName: string
  lastName: string
  isActive: boolean
  roles: UserRoleDto[]
}

export type UserRoleDto = BaseDto<string> & {
  name: string
}
