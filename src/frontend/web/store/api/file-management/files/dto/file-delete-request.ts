import { RequestBase } from "@/store/api/base/dto/request-base"

export interface FileDeleteRequest extends RequestBase {
  fileName: string
}
