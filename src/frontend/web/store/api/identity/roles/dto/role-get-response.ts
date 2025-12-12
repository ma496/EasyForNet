import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'

export type RoleGetResponse = GenericAuditableDto<string> & {
  name: string
  nameNormalized: string
  description: string
  permissions: string[]
  userCount: number
}
