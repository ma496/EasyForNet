export interface SearchableItem {
  title: string
  url: string
}

export const searchableItems: SearchableItem[] = [
  {
    title: 'search.dashboard',
    url: '/app',
  },
  {
    title: 'search.users',
    url: '/app/users/list',

  },
  {
    title: 'search.usersCreate',
    url: '/app/users/create',

  },
  {
    title: 'search.roles',
    url: '/app/roles/list',

  },
  {
    title: 'search.rolesCreate',
    url: '/app/roles/create',

  },
  {
    title: 'search.profile',
    url: '/app/profile',
  },
  {
    title: 'search.changePassword',
    url: '/app/change-password',
  },

  {
    title: 'search.uiFormElements',
    url: '/app/ui/form-elements',
  },
  {
    title: 'search.uiButtons',
    url: '/app/ui/buttons',
  },
  {
    title: 'search.uiCards',
    url: '/app/ui/cards',
  },
  {
    title: 'search.uiDatePicker',
    url: '/app/ui/date-picker',
  },
  {
    title: 'search.uiDateView',
    url: '/app/ui/date-view',
  },
  {
    title: 'search.uiTreeview',
    url: '/app/ui/treeview',
  },
  {
    title: 'search.uiFileUpload',
    url: '/app/ui/file-upload',
  },
]
