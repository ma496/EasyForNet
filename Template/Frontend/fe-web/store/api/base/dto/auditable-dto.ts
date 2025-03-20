export type CreatableDto = {
  createdAt: string
  createdBy: string
}

export type UpdatableDto = {
  updatedAt: string
  updatedBy: string
}

export type AuditableDto = CreatableDto & UpdatableDto
