import { NotificationType } from './enums'
import { BaseDto } from '@/store/api/base/dto/base-dto'
import { RequestBase } from '@/store/api/base/dto/request-base'
import { GenericAuditableDto } from '@/store/api/base/dto/auditable-dto'
import { ListRequestDto } from '@/store/api/base/dto/list-request-dto'
import { ListDto } from '@/store/api/base/dto/list-dto'

export interface NotificationCreateRequest extends RequestBase {
  type: NotificationType
  titleKey: string
  messageKey: string
  group?: string
  metadata?: string
}

export interface NotificationCreateResponse extends BaseDto<string> {
  type: NotificationType
  titleKey: string
  messageKey: string
  isRead: boolean
  group?: string
  metadata?: string
}

export interface NotificationDeleteRequest extends BaseDto<string>, RequestBase { }

export interface NotificationDeleteResponse extends BaseDto<string> {
  success: boolean
  message: string
}

export interface NotificationGetRequest extends BaseDto<string>, RequestBase { }

export interface NotificationGetResponse extends GenericAuditableDto<string> {
  type: NotificationType
  titleKey: string
  messageKey: string
  isRead: boolean
  group?: string
  metadata?: string
}

export interface NotificationListRequest extends ListRequestDto<string>, RequestBase {
  isRead?: boolean | null
  group?: string
}

export interface NotificationListResponse extends ListDto<NotificationListDto> { }

export interface NotificationListDto extends GenericAuditableDto<string> {
  type: NotificationType
  titleKey: string
  messageKey: string
  isRead: boolean
  group?: string
  metadata?: string
}

export type NotificationDto = NotificationListDto

export interface NotificationMarkAsReadRequest extends BaseDto<string>, RequestBase { }

export interface NotificationMarkAsReadResponse extends BaseDto<string> {
  success: boolean
  message: string
}

export interface NotificationMarkAsUnreadRequest extends BaseDto<string>, RequestBase { }

export interface NotificationMarkAsUnreadResponse extends BaseDto<string> {
  success: boolean
  message: string
}

export interface NotificationMarkAllAsReadRequest extends RequestBase { }

export interface NotificationMarkAllAsReadResponse extends BaseDto<string> {
  success: boolean
  message: string
}

export interface NotificationGetUnreadCountRequest extends RequestBase { }

export interface NotificationGetUnreadCountResponse {
  count: number
}

export interface NotificationGetGroupsRequest extends RequestBase { }

export interface NotificationGetGroupsResponse {
  groups: string[]
}
