import { RequestBase } from "@/store/api/base/dto/request-base"

export interface VerifyEmailRequest extends RequestBase {
  token: string
}
