import { ImageDto } from "@/store/api/base/dto/image-dto"

export type GetUserProfileResponse = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  image: ImageDto | null
}
