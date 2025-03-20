export type PermissionDefinitionResponse = {
  permissions: PermissionDefinition[]
}

export type PermissionDefinition = {
  name: string
  displayName: string
  children: PermissionDefinition[]
}
