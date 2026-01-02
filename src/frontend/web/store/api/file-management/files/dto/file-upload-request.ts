import { RequestBase } from "@/store/api/base/dto/request-base"

export interface FileUploadRequest extends RequestBase {
  file: File
}
