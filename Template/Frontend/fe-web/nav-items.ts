import { Users, Shield, Settings, Home, User, Lock } from "lucide-react"

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
        children: [
          {
            title: 'nav_users_list',
            url: '/users/list',
          },
          {
            title: 'nav_users_create',
            url: '/users/create',
          },
          {
            title: 'nav_users_update',
            url: '/users/update/{id}',
            show: false,
          }
        ]
      },
      {
        title: 'nav_roles',
        url: '/roles/list',
        icon: Shield,
        children: [
          {
            title: 'nav_roles_list',
            url: '/roles/list',
          },
          {
            title: 'nav_roles_create',
            url: '/roles/create',
          },
          {
            title: 'nav_roles_update',
            url: '/roles/update/{id}',
            show: false,
          }
        ]
      },
      {
        title: 'nav_settings',
        url: '/settings',
        icon: Settings,
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
  }
]
