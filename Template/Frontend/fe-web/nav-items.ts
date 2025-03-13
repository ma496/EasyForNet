import { Users, Shield, Settings, Home, User, Lock, Building2, UserRound, CalendarClock, BarChart4 } from "lucide-react"

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

export const navItemGroups: NavItemGroup[] = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        url: '/',
        icon: Home,
      },
      {
        title: 'CRM',
        url: '/crm',
        icon: Building2,
        children: [
          {
            title: 'Customers',
            url: '/crm/customers',
            icon: UserRound
          },
          {
            title: 'Leads',
            url: '/crm/leads',
            icon: UserRound
          },
          {
            title: 'Opportunities',
            url: '/crm/opportunities',
            icon: CalendarClock
          },
          {
            title: 'Reports',
            url: '/crm/reports',
            icon: BarChart4,
            children: [
              {
                title: 'Customer Insights',
                url: '/crm/reports/customer-insights'
              },
              {
                title: 'Pipeline Analysis',
                url: '/crm/reports/pipeline'
              },
              {
                title: 'Team Performance',
                url: '/crm/reports/performance'
              },
              {
                title: 'Sales Forecasting',
                url: '/crm/reports/forecasting'
              },
              {
                title: 'Conversion Rates',
                url: '/crm/reports/conversion'
              }
            ]
          }
        ]
      },
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
