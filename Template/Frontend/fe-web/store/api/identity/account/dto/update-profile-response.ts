import { ImageDto } from "@/store/api/base/dto/image-dto"

export type UpdateProfileResponse = {
  id: string
  email: string
  firstName: string
  lastName: string
  image: ImageDto | null
}
