import { BaseDto } from "@/store/api/base/dto/base-dto"

export type RoleUpdateResponse = BaseDto<string> & {
  name: string
  nameNormalized: string
  description: string
}
