import { RequestBase } from "@/store/api/base/dto/request-base"

export interface FileGetRequest extends RequestBase {
  fileName: string
}
