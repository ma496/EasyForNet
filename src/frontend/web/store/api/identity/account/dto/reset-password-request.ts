import { RequestBase } from "@/store/api/base/dto/request-base"

export interface ResetPasswordRequest extends RequestBase {
  token: string
  password: string
}
