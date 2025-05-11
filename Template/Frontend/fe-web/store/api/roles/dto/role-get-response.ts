import { BaseDto } from "@/store/api/base/dto/base-dto"
import { AuditableDto } from "@/store/api/base/dto/auditable-dto"

export type RoleGetResponse = BaseDto<string> & AuditableDto & {
  name: string
  nameNormalized: string
  description: string
  permissions: string[]
  userCount: number
}
