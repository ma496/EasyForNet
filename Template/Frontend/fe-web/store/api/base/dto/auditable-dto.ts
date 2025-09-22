import { BaseDto } from "./base-dto"

export type CreatableDto = {
  createdAt: string
  createdBy: string
}

export type UpdatableDto = {
  updatedAt: string
  updatedBy: string
}

export type AuditableDto = CreatableDto & UpdatableDto

export type GenericCreatableDto<TId> = {
} & CreatableDto & BaseDto<TId>

export type GenericUpdatableDto<TId> = {
} & UpdatableDto & BaseDto<TId>

export type GenericAuditableDto<TId> = {
} & AuditableDto & BaseDto<TId>
