import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'
import { ListDto } from '@/store/api/base/dto/list-dto'

export interface RoleListResponse extends ListDto<RoleListDto> { }

export interface RoleListDto extends GenericAuditableDto<string> {
  name: string
  nameNormalized: string
  description: string
  permissions: string[]
  userCount: number
}
