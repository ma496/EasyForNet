import { RequestBase } from "@/store/api/base/dto/request-base"

export interface RoleCreateRequest extends RequestBase {
  name: string
  description?: string
}
