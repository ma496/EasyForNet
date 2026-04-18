export interface SearchableItem {
  title: string
  url: string
}

export const searchableItems: SearchableItem[] = [
  {
    title: 'search.dashboard',
    url: '/admin',
  },
  {
    title: 'search.users',
    url: '/admin/users/list',

  },
  {
    title: 'search.usersCreate',
    url: '/admin/users/create',

  },
  {
    title: 'search.roles',
    url: '/admin/roles/list',

  },
  {
    title: 'search.rolesCreate',
    url: '/admin/roles/create',

  },
  {
    title: 'search.profile',
    url: '/admin/profile',
  },
  {
    title: 'search.changePassword',
    url: '/admin/change-password',
  },

  {
    title: 'search.uiFormElements',
    url: '/admin/ui/form-elements',
  },
  {
    title: 'search.uiButtons',
    url: '/admin/ui/buttons',
  },
  {
    title: 'search.uiCards',
    url: '/admin/ui/cards',
  },
  {
    title: 'search.uiDatePicker',
    url: '/admin/ui/date-picker',
  },
  {
    title: 'search.uiDateView',
    url: '/admin/ui/date-view',
  },
  {
    title: 'search.uiTreeview',
    url: '/admin/ui/treeview',
  },
  {
    title: 'search.uiFileUpload',
    url: '/admin/ui/file-upload',
  },
  {
    title: 'search.uiTooltips',
    url: '/admin/ui/tooltips',
  },
]
