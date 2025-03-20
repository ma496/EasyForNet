import { BaseDto } from "@/store/api/base/dto/base-dto"

export type ChangePermissionsRequest = BaseDto<string> & {
  permissions: string[]
}
