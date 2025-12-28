import { RequestBase } from "@/store/api/base/dto/request-base"

export type TokenRequest = RequestBase & {
  username: string
  password: string
}
