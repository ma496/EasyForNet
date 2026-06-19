'use client'

import { NavItem, NavItemGroup } from '@/nav-items'
import { SidebarNavItem } from './nav-item'

/**
 * Props for the {@link SidebarNavGroup} component, receiving the entry to render along with shared sidebar state (current menu, path, translator, toggle handler).
 */
interface NavGroupProps {
  group: NavItem | NavItemGroup
  currentMenu: string
  pathname: string
  t: (key: string) => string
  onToggleMenu: (title: string) => void
}

/**
 * Type guard that narrows a {@link NavItem} | {@link NavItemGroup} union to {@link NavItemGroup} by checking for the `items` property.
 */
const isNavItemGroup = (item: NavItem | NavItemGroup): item is NavItemGroup => {
  return 'items' in item
}

/**
 * Renders either a labeled group of sidebar nav items (with a heading) or a single {@link SidebarNavItem} when the entry is a flat nav item.
 */
export const SidebarNavGroup = ({ group, currentMenu, pathname, t, onToggleMenu }: NavGroupProps) => {
  if (isNavItemGroup(group)) {
    return (
      <div className="nav-group">
        <h2 className="dark:bg-opacity-[0.08] -mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark">
          <span>{t(group.title)}</span>
        </h2>
        <ul className="space-y-1">
          {group.items.map((item, index) => (
            <li key={`${group.title}-item-${index}`}>
              <SidebarNavItem item={item} currentMenu={currentMenu} pathname={pathname} t={t} onToggleMenu={onToggleMenu} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <ul className="space-y-1">
      <li>
        <SidebarNavItem item={group} currentMenu={currentMenu} pathname={pathname} t={t} onToggleMenu={onToggleMenu} />
      </li>
    </ul>
  )
}
