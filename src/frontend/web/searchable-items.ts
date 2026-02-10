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
    title: 'search.users_create',
    url: '/app/users/create',

  },
  {
    title: 'search.roles',
    url: '/app/roles/list',

  },
  {
    title: 'search.roles_create',
    url: '/app/roles/create',

  },
  {
    title: 'search.profile',
    url: '/app/profile',
  },
  {
    title: 'search.change_password',
    url: '/app/change-password',
  },

  {
    title: 'search.ui_form_elements',
    url: '/app/ui/form-elements',
  },
  {
    title: 'search.ui_buttons',
    url: '/app/ui/buttons',
  },
  {
    title: 'search.ui_cards',
    url: '/app/ui/cards',
  },
  {
    title: 'search.ui_date_picker',
    url: '/app/ui/date-picker',
  },
  {
    title: 'search.ui_date_view',
    url: '/app/ui/date-view',
  },
  {
    title: 'search.ui_treeview',
    url: '/app/ui/treeview',
  },
  {
    title: 'search.ui_file_upload',
    url: '/app/ui/file-upload',
  },
]
