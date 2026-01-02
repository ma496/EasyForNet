import { RequestBase } from "@/store/api/base/dto/request-base"

export interface ChangePasswordRequest extends RequestBase {
  currentPassword: string
  newPassword: string
}
