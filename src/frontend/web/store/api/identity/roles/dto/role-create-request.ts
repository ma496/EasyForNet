import { RequestBase } from "@/store/api/base/dto/request-base"

export type RoleCreateRequest = RequestBase & {
  name: string
  description?: string
}
