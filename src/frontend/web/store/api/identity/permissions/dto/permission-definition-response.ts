export interface PermissionDefinitionResponse {
  permissions: PermissionDefinition[]
}

export interface PermissionDefinition {
  name: string
  displayName: string
  children: PermissionDefinition[]
}
