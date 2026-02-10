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
        title: 'navigation.dashboard_sales',
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
            title: 'navigation.users_list',
            url: '/app/users/list',

          },
          {
            title: 'navigation.users_create',
            url: '/app/users/create',

          },
          {
            title: 'navigation.users_update',
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
            title: 'navigation.roles_list',
            url: '/app/roles/list',

          },
          {
            title: 'navigation.roles_create',
            url: '/app/roles/create',

          },
          {
            title: 'navigation.roles_update',
            url: '/app/roles/update/{id}',

            show: false,
          },
          {
            title: 'navigation.roles_change_permissions',
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
        title: 'navigation.ui_form_elements',
        url: '/app/ui/form-elements',
        icon: FormInput,
      },
      {
        title: 'navigation.ui_buttons',
        url: '/app/ui/buttons',
        icon: Zap,
      },
      {
        title: 'navigation.ui_cards',
        url: '/app/ui/cards',
        icon: Palette,
      },
      {
        title: 'navigation.ui_date_picker',
        url: '/app/ui/date-picker',
        icon: Calendar,
      },
      {
        title: 'navigation.ui_date_view',
        url: '/app/ui/date-view',
        icon: Clock,
      },

      {
        title: 'navigation.ui_treeview',
        url: '/app/ui/treeview',
        icon: TreePine,
      },
      {
        title: 'navigation.ui_file_upload',
        url: '/app/ui/file-upload',
        icon: Upload,
      },
    ],
  },
  {
    title: 'navigation.change_password',
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
