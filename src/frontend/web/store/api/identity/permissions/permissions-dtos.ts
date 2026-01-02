export interface PermissionDefinitionResponse {
  permissions: PermissionDefinition[]
}

export interface PermissionDefinition {
  name: string
  displayName: string
  children: PermissionDefinition[]
}

export interface PermissionResponse {
  permissions: PermissionDto[]
}

export interface PermissionDto {
  id: string
  name: string
  displayName: string
}
