import { Allow } from './allow'

export interface AuthUrl {
  url: string
  permissions?: string[]
}

export const authUrls: AuthUrl[] = [
  {
    url: '/admin',
  },
  {
    url: '/admin/users/list',
    permissions: [Allow.User_View],
  },
  {
    url: '/admin/users/create',
    permissions: [Allow.User_Create],
  },
  {
    url: '/admin/users/update/{id}',
    permissions: [Allow.User_Update],
  },
  {
    url: '/admin/roles/list',
    permissions: [Allow.Role_View],
  },
  {
    url: '/admin/roles/create',
    permissions: [Allow.Role_Create],
  },
  {
    url: '/admin/roles/update/{id}',
    permissions: [Allow.Role_Update],
  },
  {
    url: '/admin/roles/change-permissions/{id}',
    permissions: [Allow.Role_ChangePermissions],
  },
]

export const getMatchedAuthUrl = (url: string): AuthUrl | undefined => {
  const pathname = url.split('?')[0]
  const matches = authUrls.filter((authUrl) => {
    if (authUrl.url === pathname) {
      return true
    }

    // Handle dynamic segments like {id}
    if (authUrl.url.includes('{')) {
      const pattern = authUrl.url.replace(/\{[^}]+\}/g, '[^/]+')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(pathname)
    }

    return false
  })

  if (matches.length > 1) {
    throw new Error(
      `Multiple auth URLs matched for: ${url}. Matches: ${matches.map((m) => m.url).join(', ')}`,
    )
  }

  if (matches.length === 0) {
    return undefined
  }

  return matches[0]
}

export const isAuthRequired = (url: string) => {
  return url.includes('/admin/') || !!getMatchedAuthUrl(url)
}

