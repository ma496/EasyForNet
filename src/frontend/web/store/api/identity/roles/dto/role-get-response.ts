import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'

export interface RoleGetResponse extends GenericAuditableDto<string> {
  name: string
  nameNormalized: string
  description: string
  permissions: string[]
  userCount: number
}
