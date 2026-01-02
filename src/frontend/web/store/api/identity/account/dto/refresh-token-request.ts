import { RequestBase } from "@/store/api/base/dto/request-base"

export interface RefreshTokenRequest extends RequestBase {
  userId: string
  refreshToken: string
}
