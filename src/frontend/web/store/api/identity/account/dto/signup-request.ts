import { RequestBase } from "@/store/api/base/dto/request-base"

export type SignupRequest = RequestBase & {
  username: string
  email: string
  password?: string
  confirmPassword?: string
}
