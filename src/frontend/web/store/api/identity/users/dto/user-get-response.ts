import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'

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
