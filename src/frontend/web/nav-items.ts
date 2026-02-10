import { Users, Shield, Home, User, Lock, Palette, Zap, Calendar, TreePine, FormInput, Upload, Clock } from 'lucide-react'
import type { ElementType } from 'react'


export interface NavItemGroup {
  title: string
  items: NavItem[]
}

export interface NavItem {
  title: string
  url: string
  icon?: ElementType
  badge?: number
  group?: string
  show?: boolean
  isActive?: boolean
  children?: NavItem[]
}

export const navItems: (NavItem | NavItemGroup)[] = [
  {
    title: 'navigation.dashboard',
    url: '/app',
    icon: Home,
    children: [
      {
        title: 'navigation.dashboardSales',
        url: '/app',
      },
    ],
  },
  {
    title: 'navigation.administration',
    items: [
      {
        title: 'navigation.users',
        url: '/app/users/list',
        icon: Users,

        children: [
          {
            title: 'navigation.usersList',
            url: '/app/users/list',

          },
          {
            title: 'navigation.usersCreate',
            url: '/app/users/create',

          },
          {
            title: 'navigation.usersUpdate',
            url: '/app/users/update/{id}',

            show: false,
          },
        ],
      },
      {
        title: 'navigation.roles',
        url: '/app/roles/list',
        icon: Shield,

        children: [
          {
            title: 'navigation.rolesList',
            url: '/app/roles/list',

          },
          {
            title: 'navigation.rolesCreate',
            url: '/app/roles/create',

          },
          {
            title: 'navigation.rolesUpdate',
            url: '/app/roles/update/{id}',

            show: false,
          },
          {
            title: 'navigation.rolesChangePermissions',
            url: '/app/roles/change-permissions/{id}',

            show: false,
          },
        ],
      },
    ],
  },
  {
    title: 'navigation.components',
    items: [
      {
        title: 'navigation.uiFormElements',
        url: '/app/ui/form-elements',
        icon: FormInput,
      },
      {
        title: 'navigation.uiButtons',
        url: '/app/ui/buttons',
        icon: Zap,
      },
      {
        title: 'navigation.uiCards',
        url: '/app/ui/cards',
        icon: Palette,
      },
      {
        title: 'navigation.uiDatePicker',
        url: '/app/ui/date-picker',
        icon: Calendar,
      },
      {
        title: 'navigation.uiDateView',
        url: '/app/ui/date-view',
        icon: Clock,
      },

      {
        title: 'navigation.uiTreeview',
        url: '/app/ui/treeview',
        icon: TreePine,
      },
      {
        title: 'navigation.uiFileUpload',
        url: '/app/ui/file-upload',
        icon: Upload,
      },
    ],
  },
  {
    title: 'navigation.changePassword',
    url: '/app/change-password',
    icon: Lock,
    show: false,
  },
  {
    title: 'navigation.profile',
    url: '/app/profile',
    icon: User,
    show: false,
  },
]
