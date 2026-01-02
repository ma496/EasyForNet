import { RequestBase } from "@/store/api/base/dto/request-base"

export interface ForgetPasswordRequest extends RequestBase {
  email: string
}
