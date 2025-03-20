import { BaseDto } from "@/store/api/base/dto/base-dto"
import { AuditableDto } from "@/store/api/base/dto/auditable-dto"

export type UserGetResponse = BaseDto<string> & AuditableDto & {
  username: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
