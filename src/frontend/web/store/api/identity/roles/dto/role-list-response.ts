import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'
import { ListDto } from '@/store/api/base/dto/list-dto'

export type RoleListResponse = ListDto<RoleListDto>

export type RoleListDto = GenericAuditableDto<string> & {
  name: string
  nameNormalized: string
  description: string
  permissions: string[]
  userCount: number
}
