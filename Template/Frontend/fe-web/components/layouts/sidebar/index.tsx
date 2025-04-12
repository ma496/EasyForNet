'use client';

import PerfectScrollbar from 'react-perfect-scrollbar';
import Link from 'next/link';
import { toggleSidebar } from '@/store/slices/themeConfigSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useState, useEffect } from 'react';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { navItems, NavItem, NavItemGroup } from '@/nav-items';
import { SidebarNavGroup } from './nav-group';
import { isAllowed } from '@/store/slices/authSlice';

const isNavItemGroup = (item: NavItem | NavItemGroup): item is NavItemGroup => {
  return 'items' in item;
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { t } = getTranslation();
  const pathname = usePathname();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const themeConfig = useAppSelector((state) => state.theme);
  const semidark = useAppSelector((state) => state.theme.semidark);

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };

  const getFilteredNavItems = (): (NavItem | NavItemGroup)[] => {
    const authState = useAppSelector(state => state.auth);

    // Helper function to recursively filter children
    const filterNavItem = (item: NavItem): NavItem | null => {
      // Check if the item should be shown and if the user has permission
      if (item.show === false || !isAllowed(authState, item.permissions || [])) {
        return null;
      }

      // If item has children, recursively filter them
      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children
          .map(filterNavItem)
          .filter((child): child is NavItem => child !== null);

        // If no children remain after filtering, don't show the parent
        if (filteredChildren.length === 0) {
          return null;
        }

        // Return a new item with filtered children
        return {
          ...item,
          children: filteredChildren
        };
      }

      // Item has no children and passes the conditions
      return item;
    };

    // Process the navItems array
    return navItems.reduce<(NavItem | NavItemGroup)[]>((filtered, item) => {
      if (isNavItemGroup(item)) {
        // For groups, filter each item in the group
        const filteredItems = item.items
          .map(filterNavItem)
          .filter((groupItem): groupItem is NavItem => groupItem !== null);

        // Only include the group if it has at least one valid item
        if (filteredItems.length > 0) {
          filtered.push({
            ...item,
            items: filteredItems
          });
        }
      } else {
        // For regular items, apply the filter directly
        const filteredItem = filterNavItem(item);
        if (filteredItem !== null) {
          filtered.push(filteredItem);
        }
      }

      return filtered;
    }, []);
  };

  const [filteredNavItems, _] = useState<(NavItem | NavItemGroup)[]>(getFilteredNavItems());

  useEffect(() => {
    // Find and set active parent menu based on current path
    const findActiveParent = () => {
      filteredNavItems.forEach((group) => {
        if (isNavItemGroup(group)) {
          group.items.forEach((item) => {
            if (item.children?.some(child => child.url === pathname)) {
              setCurrentMenu(item.title);
            }
          });
        } else if (group.children?.some(child => child.url === pathname)) {
          setCurrentMenu(group.title);
        }
      });
    };

    findActiveParent();
  }, [pathname]);

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [pathname]);

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img className="ml-[5px] w-8 flex-none" src="/assets/images/icon.png" alt="logo" />
              <span className="align-middle text-[18px] font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">Easy For Net</span>
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <div className="relative space-y-0.5 p-4 py-0 font-semibold">
              {filteredNavItems.map((group, index) => (
                <SidebarNavGroup
                  key={`nav-group-${index}`}
                  group={group}
                  currentMenu={currentMenu}
                  pathname={pathname}
                  t={t}
                  onToggleMenu={toggleMenu}
                />
              ))}
            </div>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
