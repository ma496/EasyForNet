import { RequestBase } from "@/store/api/base/dto/request-base"

export interface SignupRequest extends RequestBase {
  username: string
  email: string
  password?: string
  confirmPassword?: string
}
