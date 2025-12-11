import { Users, Shield, Home, User, Lock, Palette, Zap, Calendar, TreePine, FormInput, Upload, Tag, Box, Layers } from 'lucide-react'


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
    url: '/app',
    icon: Home,
    children: [
      {
        title: 'nav_dashboard_sales',
        url: '/app',
      },
    ],
  },
  {
    title: 'nav_administration',
    items: [
      {
        title: 'nav_users',
        url: '/app/users/list',
        icon: Users,

        children: [
          {
            title: 'nav_users_list',
            url: '/app/users/list',

          },
          {
            title: 'nav_users_create',
            url: '/app/users/create',

          },
          {
            title: 'nav_users_update',
            url: '/app/users/update/{id}',

            show: false,
          },
        ],
      },
      {
        title: 'nav_roles',
        url: '/app/roles/list',
        icon: Shield,

        children: [
          {
            title: 'nav_roles_list',
            url: '/app/roles/list',

          },
          {
            title: 'nav_roles_create',
            url: '/app/roles/create',

          },
          {
            title: 'nav_roles_update',
            url: '/app/roles/update/{id}',

            show: false,
          },
          {
            title: 'nav_roles_change_permissions',
            url: '/app/roles/change-permissions/{id}',

            show: false,
          },
        ],
      },
    ],
  },
  {
    title: 'nav_components',
    items: [
      {
        title: 'nav_ui_form_elements',
        url: '/app/ui/form-elements',
        icon: FormInput,
      },
      {
        title: 'nav_ui_buttons',
        url: '/app/ui/buttons',
        icon: Zap,
      },
      {
        title: 'nav_ui_cards',
        url: '/app/ui/cards',
        icon: Palette,
      },
      {
        title: 'nav_ui_date_picker',
        url: '/app/ui/date-picker',
        icon: Calendar,
      },

      {
        title: 'nav_ui_treeview',
        url: '/app/ui/treeview',
        icon: TreePine,
      },
      {
        title: 'nav_ui_file_upload',
        url: '/app/ui/file-upload',
        icon: Upload,
      },
    ],
  },
  {
    title: 'nav_change_password',
    url: '/app/change-password',
    icon: Lock,
    show: false,
  },
  {
    title: 'nav_profile',
    url: '/app/profile',
    icon: User,
    show: false,
  },
]
