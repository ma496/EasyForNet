import { RequestBase } from "@/store/api/base/dto/request-base"

export type ResetPasswordRequest = RequestBase & {
  token: string
  password: string
}
