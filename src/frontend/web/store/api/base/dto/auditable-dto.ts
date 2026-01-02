import { BaseDto } from './base-dto'

export interface CreatableDto {
  createdAt: string
  createdBy: string
}

export interface UpdatableDto {
  updatedAt: string
  updatedBy: string
}

export interface AuditableDto extends CreatableDto, UpdatableDto { }

export interface GenericCreatableDto<TId> extends CreatableDto, BaseDto<TId> { }

export interface GenericUpdatableDto<TId> extends UpdatableDto, BaseDto<TId> { }

export interface GenericAuditableDto<TId> extends AuditableDto, BaseDto<TId> { }
