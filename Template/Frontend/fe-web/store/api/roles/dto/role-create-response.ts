import { BaseDto } from "@/store/api/base/dto/base-dto"

export type RoleCreateResponse = BaseDto<string> & {
  name: string
  description: string
}
