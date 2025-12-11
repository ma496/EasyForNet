export type SearchableItem = {
  title: string
  url: string

}

export const searchableItems: SearchableItem[] = [
  {
    title: 'search_dashboard',
    url: '/app',
  },
  {
    title: 'search_users',
    url: '/app/users/list',

  },
  {
    title: 'search_users_create',
    url: '/app/users/create',

  },
  {
    title: 'search_roles',
    url: '/app/roles/list',

  },
  {
    title: 'search_roles_create',
    url: '/app/roles/create',

  },
  {
    title: 'search_profile',
    url: '/app/profile',
  },
  {
    title: 'search_change_password',
    url: '/app/change-password',
  },

  {
    title: 'search_ui_form_elements',
    url: '/app/ui/form-elements',
  },
  {
    title: 'search_ui_buttons',
    url: '/app/ui/buttons',
  },
  {
    title: 'search_ui_cards',
    url: '/app/ui/cards',
  },
  {
    title: 'search_ui_date_picker',
    url: '/app/ui/date-picker',
  },
  {
    title: 'search_ui_treeview',
    url: '/app/ui/treeview',
  },
  {
    title: 'search_ui_file_upload',
    url: '/app/ui/file-upload',
  },
]
