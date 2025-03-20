import { BaseDto } from "@/store/api/base/dto/base-dto"

export type RoleUpdateResponse = BaseDto<string> & {
  name: string
  description: string
}
