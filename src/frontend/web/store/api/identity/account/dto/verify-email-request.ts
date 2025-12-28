import { RequestBase } from "@/store/api/base/dto/request-base"

export type VerifyEmailRequest = RequestBase & {
  token: string
}
