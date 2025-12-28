import { RequestBase } from "@/store/api/base/dto/request-base"

export type FileUploadRequest = RequestBase & {
  file: File
}
