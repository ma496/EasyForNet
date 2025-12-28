import { RequestBase } from "@/store/api/base/dto/request-base"

export type UpdateProfileRequest = RequestBase & {
  email: string
  firstName: string | undefined
  lastName: string | undefined
  image: string | undefined
}
