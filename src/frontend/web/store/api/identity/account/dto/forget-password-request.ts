import { RequestBase } from "@/store/api/base/dto/request-base"

export type ForgetPasswordRequest = RequestBase & {
  email: string
}
