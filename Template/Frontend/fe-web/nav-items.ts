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
        url: '/users',
        icon: Users,
      },
      {
        title: 'nav_roles',
        url: '/roles',
        icon: Shield,
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
