import { RequestBase } from "@/store/api/base/dto/request-base"

export type FileGetRequest = RequestBase & {
  fileName: string
}
