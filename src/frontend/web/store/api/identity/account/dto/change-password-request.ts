import { RequestBase } from "@/store/api/base/dto/request-base"

export type ChangePasswordRequest = RequestBase & {
  currentPassword: string
  newPassword: string
}
