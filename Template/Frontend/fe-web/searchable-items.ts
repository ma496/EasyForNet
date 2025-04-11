import { getTranslation } from "./i18n";

export type SearchableItem = {
  title: string;
  url: string;
}

export const searchableItems: SearchableItem[] = [
  {
    title: 'search_home',
    url: '/',
  },
  {
    title: 'search_users',
    url: '/users/list',
  },
  {
    title: 'search_users_create',
    url: '/users/create',
  },
  {
    title: 'search_roles',
    url: '/roles/list',
  },
  {
    title: 'search_roles_create',
    url: '/roles/create',
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

const { t } = getTranslation();

export const getSearchableItems = (query: string): SearchableItem[] => {
  if (!query || query.trim() === '') {
    return [];
  }
  return searchableItems
    .filter((item) => t(item.title).toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 5);
};


