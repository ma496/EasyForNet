import { BaseDto } from "@/store/api/base/dto/base-dto"

export type ChangePermissionsResponse = BaseDto<string> & {
  permissions: string[]
}

