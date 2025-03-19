'use client';

import { NavItem, NavItemGroup } from '@/nav-items';
import { SidebarNavItem } from './nav-item';

interface NavGroupProps {
  group: NavItem | NavItemGroup;
  currentMenu: string;
  pathname: string;
  t: (key: string) => string;
  onToggleMenu: (title: string) => void;
}

const isNavItemGroup = (item: NavItem | NavItemGroup): item is NavItemGroup => {
  return 'items' in item;
};

export const SidebarNavGroup = ({ group, currentMenu, pathname, t, onToggleMenu }: NavGroupProps) => {
  if (isNavItemGroup(group)) {
    return (
      <div className="nav-group">
        <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
          <span>{t(group.title.toLowerCase())}</span>
        </h2>
        <ul className="space-y-1">
          {group.items.map((item, index) => (
            <li key={`${group.title}-item-${index}`}>
              <SidebarNavItem
                item={item}
                currentMenu={currentMenu}
                pathname={pathname}
                t={t}
                onToggleMenu={onToggleMenu}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      <li>
        <SidebarNavItem
          item={group}
          currentMenu={currentMenu}
          pathname={pathname}
          t={t}
          onToggleMenu={onToggleMenu}
        />
      </li>
    </ul>
  );
};
