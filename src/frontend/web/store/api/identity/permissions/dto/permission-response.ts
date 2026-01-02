export interface PermissionResponse {
  permissions: PermissionDto[]
}

export interface PermissionDto {
  id: string
  name: string
  displayName: string
}
