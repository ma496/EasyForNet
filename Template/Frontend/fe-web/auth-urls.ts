import { Allow } from './allow'

export type AuthUrl = {
  url: string
  permissions?: string[]
}

export const authUrls: AuthUrl[] = [
  {
    url: '/app',
  },
  {
    url: '/app/users/list',
    permissions: [Allow.User_View],
  },
  {
    url: '/app/users/create',
    permissions: [Allow.User_Create],
  },
  {
    url: '/app/users/update/{id}',
    permissions: [Allow.User_Update],
  },
  {
    url: '/app/roles/list',
    permissions: [Allow.Role_View],
  },
  {
    url: '/app/roles/create',
    permissions: [Allow.Role_Create],
  },
  {
    url: '/app/roles/update/{id}',
    permissions: [Allow.Role_Update],
  },
  {
    url: '/app/roles/change-permissions/{id}',
    permissions: [Allow.Role_ChangePermissions],
  },
]

export const isAuthUrl = (url: string) => {
  return url.includes('/app/') || authUrls.some((authUrl) => authUrl.url === url)
}

