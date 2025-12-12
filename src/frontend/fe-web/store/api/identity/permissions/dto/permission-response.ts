export type PermissionResponse = {
  permissions: PermissionDto[]
}

export type PermissionDto = {
  id: string
  name: string
  displayName: string
}
