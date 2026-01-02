import { RequestBase } from "@/store/api/base/dto/request-base"

export interface ResendVerifyEmailRequest extends RequestBase {
  emailOrUsername: string
}
