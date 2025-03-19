'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconCaretDown from '@/components/icon/icon-caret-down';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { navItems, NavItem, NavItemGroup } from '@/nav-items';

const isNavItemGroup = (item: NavItem | NavItemGroup): item is NavItemGroup => {
  return 'items' in item;
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { t } = getTranslation();
  const pathname = usePathname();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };

  const isChildActive = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some(child => child.url === pathname);
  };

  useEffect(() => {
    // Find and set active parent menu based on current path
    const findActiveParent = () => {
      navItems.forEach((group) => {
        if (isNavItemGroup(group)) {
          group.items.forEach((item) => {
            if (isChildActive(item.children)) {
              setCurrentMenu(item.title);
            }
          });
        } else if (isChildActive(group.children)) {
          setCurrentMenu(group.title);
        }
      });
    };

    findActiveParent();
  }, [pathname]);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [pathname]);

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll('.sidebar ul a.active');
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove('active');
    }
    const selector = document.querySelector('.sidebar ul a[href="' + pathname + '"]');
    selector?.classList.add('active');
  };

  const renderNavItem = (item: NavItem) => {
    if (item.show === false) return null;
    const isActive = isChildActive(item.children);

    return (
      <li className="menu nav-item">
        {item.children ? (
          <>
            <button
              type="button"
              className={`${currentMenu === item.title ? 'active' : ''} nav-link group w-full`}
              onClick={() => toggleMenu(item.title)}
            >
              <div className="flex items-center">
                {item.icon && <item.icon className="shrink-0 w-5 h-5 group-hover:!text-primary" />}
                <span className={`text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark ${isActive ? 'text-primary' : ''}`}>
                  {t(item.title)}
                </span>
              </div>

              <div className={currentMenu !== item.title ? '-rotate-90 rtl:rotate-90' : ''}>
                <IconCaretDown />
              </div>
            </button>

            <AnimateHeight duration={300} height={currentMenu === item.title ? 'auto' : 0}>
              <ul className="sub-menu text-gray-500">
                {item.children.map((child, childIndex) => (
                  <li key={childIndex}>
                    <Link
                      href={child.url}
                      className={pathname === child.url ? 'text-primary' : ''}
                    >
                      {t(child.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimateHeight>
          </>
        ) : (
          <Link href={item.url} className="group">
            <div className="flex items-center">
              {item.icon && <item.icon className="shrink-0 w-5 h-5 group-hover:!text-primary" />}
              <span className={`text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark ${pathname === item.url ? 'text-primary' : ''}`}>
                {t(item.title)}
              </span>
            </div>
          </Link>
        )}
      </li>
    );
  };

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img className="ml-[5px] w-8 flex-none" src="/assets/images/icon.png" alt="logo" />
              <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">Easy For Net</span>
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
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              {navItems.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {isNavItemGroup(group) ? (
                    <>
                      <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                        <span>{t(group.title.toLowerCase())}</span>
                      </h2>
                      {group.items.map((item, itemIndex) => renderNavItem(item))}
                    </>
                  ) : (
                    renderNavItem(group)
                  )}
                </div>
              ))}
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
