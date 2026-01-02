import { RequestBase } from "@/store/api/base/dto/request-base"

export interface UpdateProfileRequest extends RequestBase {
  email: string
  firstName: string | undefined
  lastName: string | undefined
  image: string | undefined
}
