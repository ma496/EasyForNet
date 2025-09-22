'use client';

import Link from 'next/link';
import { NavItem } from '@/nav-items';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '@/components/icon/icon-caret-down';

interface NavItemProps {
  item: NavItem;
  currentMenu: string;
  pathname: string;
  t: (key: string) => string;
  onToggleMenu: (title: string) => void;
}

export const SidebarNavItem = ({ item, currentMenu, pathname, t, onToggleMenu }: NavItemProps) => {
  if (item.children) {
    return (
      <div className="nav-item">
        <button
          type="button"
          className={`${currentMenu === item.title ? 'active' : ''} nav-link group w-full`}
          onClick={() => onToggleMenu(item.title)}
        >
          <div className="flex items-center">
            {item.icon && <item.icon className="shrink-0 w-5 h-5 group-hover:!text-primary" />}
            <span className={`text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark`}>
              {t(item.title.toLowerCase())}
            </span>
          </div>

          <div className={currentMenu !== item.title ? '-rotate-90 rtl:rotate-90' : ''}>
            <IconCaretDown />
          </div>
        </button>

        <AnimateHeight duration={300} height={currentMenu === item.title ? 'auto' : 0}>
          <ul className="sub-menu text-gray-500">
            {item.children.filter(child => child.show !== false).map((child, index) => (
              <li key={`${item.title}-child-${index}`}>
                <Link
                  href={child.url as any}
                  className={`flex items-center ${pathname === child.url ? 'active' : ''}`}
                >
                  {child.icon ? (
                    <child.icon className="shrink-0 w-4 h-4 ltr:mr-3 rtl:ml-3" />
                  ) : (
                    <span className={`ltr:mr-3 rtl:ml-3`}>-</span>
                  )}
                  <span>{t(child.title.toLowerCase())}</span>
                </Link>
              </li>
            ))}
          </ul>
        </AnimateHeight>
      </div>
    );
  }

  return (
    <div className="nav-item">
      <Link href={item.url as any} className={`group ${pathname === item.url ? 'active' : ''}`}>
        <div className="flex items-center">
          {item.icon && <item.icon className="shrink-0 w-5 h-5 group-hover:!text-primary" />}
          <span className={`text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark`}>
            {t(item.title.toLowerCase())}
          </span>
        </div>
      </Link>
    </div>
  );
};
