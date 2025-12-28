import { RequestBase } from "@/store/api/base/dto/request-base"

export type ResendVerifyEmailRequest = RequestBase & {
  emailOrUsername: string
}
