import { RequestBase } from "@/store/api/base/dto/request-base"

export interface TokenRequest extends RequestBase {
  username: string
  password: string
}
