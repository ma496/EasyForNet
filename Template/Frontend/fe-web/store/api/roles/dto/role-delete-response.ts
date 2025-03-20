import { BaseDto } from "@/store/api/base/dto/base-dto"

export type RoleDeleteResponse = BaseDto<string> & {
  success: boolean
  message: string
}
