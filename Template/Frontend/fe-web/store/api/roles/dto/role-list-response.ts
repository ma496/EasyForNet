import { BaseDto } from "@/store/api/base/dto/base-dto"
import { AuditableDto } from "@/store/api/base/dto/auditable-dto"
import { ListDto } from "@/store/api/base/dto/list-dto"

export type RoleListResponse = ListDto<RoleListDto>

export type RoleListDto = BaseDto<string> & AuditableDto & {
  name: string
  description: string
  permissions: string[]
  userCount: number
}
