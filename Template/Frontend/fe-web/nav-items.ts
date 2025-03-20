import { Users, Shield, Settings, Bug, Building, Home, User, Lock } from "lucide-react"

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
    title: 'Dashboard',
    url: '/',
    icon: Home,
    children: [
      {
        title: 'Sales',
        url: '/',
      }
    ]
  },
  {
    title: 'Administration',
    items: [
      {
        title: 'Users',
        url: '/users',
        icon: Users,
      },
      {
        title: 'Roles',
        url: '/roles',
        icon: Shield,
      },
      {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
      },
      {
        title: 'ChangePassword',
        url: '/change-password',
        icon: Lock,
        show: false,
      },
      {
        title: 'Profile',
        url: '/profile',
        icon: User,
        show: false,
      },
    ]
  }
]
