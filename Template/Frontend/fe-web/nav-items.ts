import { Users, Shield, Settings, Home, User, Lock } from "lucide-react"
import { Allow } from "./allow"

export type NavItemGroup = {
  title: string
  items: NavItem[]
}

export type NavItem = {
  title: string
  url: string
  icon?: any
  badge?: number
  group?: string
  show?: boolean
  isActive?: boolean
  children?: NavItem[]
  permissions?: string[]
}

export const navItems: (NavItem | NavItemGroup)[] = [
  {
    title: 'nav_dashboard',
    url: '/',
    icon: Home,
    children: [
      {
        title: 'nav_dashboard_sales',
        url: '/',
      }
    ]
  },
  {
    title: 'nav_administration',
    items: [
      {
        title: 'nav_users',
        url: '/users/list',
        icon: Users,
        permissions: [Allow.User_View],
        children: [
          {
            title: 'nav_users_list',
            url: '/users/list',
            permissions: [Allow.User_View],
          },
          {
            title: 'nav_users_create',
            url: '/users/create',
            permissions: [Allow.User_Create],
          },
          {
            title: 'nav_users_update',
            url: '/users/update/{id}',
            permissions: [Allow.User_Update],
            show: false,
          }
        ]
      },
      {
        title: 'nav_roles',
        url: '/roles/list',
        icon: Shield,
        permissions: [Allow.Role_View],
        children: [
          {
            title: 'nav_roles_list',
            url: '/roles/list',
            permissions: [Allow.Role_View],
          },
          {
            title: 'nav_roles_create',
            url: '/roles/create',
            permissions: [Allow.Role_Create],
          },
          {
            title: 'nav_roles_update',
            url: '/roles/update/{id}',
            permissions: [Allow.Role_Update],
            show: false,
          },
          {
            title: 'nav_roles_change_permissions',
            url: '/roles/change-permissions/{id}',
            permissions: [Allow.Role_ChangePermissions],
            show: false,
          }
        ]
      },
      {
        title: 'nav_settings',
        url: '/settings',
        icon: Settings,
      },
    ]
  },
  {
    title: 'nav_change_password',
    url: '/change-password',
    icon: Lock,
    show: false,
  },
  {
    title: 'nav_profile',
    url: '/profile',
    icon: User,
    show: false,
  },
]
