import { RequestBase } from "@/store/api/base/dto/request-base"

export type FileDeleteRequest = RequestBase & {
  fileName: string
}
