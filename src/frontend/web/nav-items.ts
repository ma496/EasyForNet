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
    url: '/admin',
    icon: Home,
    children: [
      {
        title: 'navigation.dashboardSales',
        url: '/admin',
      },
    ],
  },
  {
    title: 'navigation.administration',
    items: [
      {
        title: 'navigation.users',
        url: '/admin/users/list',
        icon: Users,

        children: [
          {
            title: 'navigation.usersList',
            url: '/admin/users/list',

          },
          {
            title: 'navigation.usersCreate',
            url: '/admin/users/create',

          },
          {
            title: 'navigation.usersUpdate',
            url: '/admin/users/update/{id}',

            show: false,
          },
        ],
      },
      {
        title: 'navigation.roles',
        url: '/admin/roles/list',
        icon: Shield,

        children: [
          {
            title: 'navigation.rolesList',
            url: '/admin/roles/list',

          },
          {
            title: 'navigation.rolesCreate',
            url: '/admin/roles/create',

          },
          {
            title: 'navigation.rolesUpdate',
            url: '/admin/roles/update/{id}',

            show: false,
          },
          {
            title: 'navigation.rolesChangePermissions',
            url: '/admin/roles/change-permissions/{id}',

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
        url: '/admin/ui/form-elements',
        icon: FormInput,
      },
      {
        title: 'navigation.uiButtons',
        url: '/admin/ui/buttons',
        icon: Zap,
      },
      {
        title: 'navigation.uiCards',
        url: '/admin/ui/cards',
        icon: Palette,
      },
      {
        title: 'navigation.uiDatePicker',
        url: '/admin/ui/date-picker',
        icon: Calendar,
      },
      {
        title: 'navigation.uiDateView',
        url: '/admin/ui/date-view',
        icon: Clock,
      },

      {
        title: 'navigation.uiTreeview',
        url: '/admin/ui/treeview',
        icon: TreePine,
      },
      {
        title: 'navigation.uiFileUpload',
        url: '/admin/ui/file-upload',
        icon: Upload,
      },
      {
        title: 'navigation.uiTooltips',
        url: '/admin/ui/tooltips',
        icon: Palette,
      },
    ],
  },
  {
    title: 'navigation.changePassword',
    url: '/admin/change-password',
    icon: Lock,
    show: false,
  },
  {
    title: 'navigation.profile',
    url: '/admin/profile',
    icon: User,
    show: false,
  },
]
