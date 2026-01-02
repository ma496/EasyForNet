import { ListRequestDto } from '@/store/api/base/dto/list-request-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'

export interface UserListRequest extends ListRequestDto<string>, RequestBase { }
