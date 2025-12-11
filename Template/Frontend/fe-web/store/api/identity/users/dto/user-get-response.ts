import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'

export type UserGetResponse = GenericAuditableDto<string> & {
  username: string
  usernameNormalized: string
  email: string
  emailNormalized: string
  firstName?: string
  lastName?: string
  isActive: boolean
  roles: string[]
}
