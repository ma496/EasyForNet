import { Allow } from "./allow";

export type SearchableItem = {
  title: string;
  url: string;
  permissions?: string[];
}

export const searchableItems: SearchableItem[] = [
  {
    title: 'search_home',
    url: '/',
  },
  {
    title: 'search_users',
    url: '/users/list',
    permissions: [Allow.User_View],
  },
  {
    title: 'search_users_create',
    url: '/users/create',
    permissions: [Allow.User_Create],
  },
  {
    title: 'search_roles',
    url: '/roles/list',
    permissions: [Allow.Role_View],
  },
  {
    title: 'search_roles_create',
    url: '/roles/create',
    permissions: [Allow.Role_Create],
  },
  {
    title: 'search_settings',
    url: '/settings',
  },
  {
    title: 'search_change_password',
    url: '/change-password',
  },
  {
    title: 'search_profile',
    url: '/profile',
  },
];


