import { BaseDto } from '@/store/api/base/dto/base-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'

export type UserDeleteRequest = BaseDto<string> & RequestBase
