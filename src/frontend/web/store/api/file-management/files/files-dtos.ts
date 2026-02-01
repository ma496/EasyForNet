import { RequestBase } from "@/store/api/base/dto/request-base"

export interface FileDeleteRequest extends RequestBase {
  fileName: string
}

export interface FileDeleteResponse { }

export interface FileGetRequest extends RequestBase {
  fileName: string
}

export interface FileUploadRequest extends RequestBase {
  file: File
}

export interface FileUploadResponse {
  fileName: string
}
