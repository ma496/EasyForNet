import { RequestBase } from "@/store/api/base/dto/request-base"

export type RefreshTokenRequest = RequestBase & {
  userId: string
  refreshToken: string
}
