'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toggleSidebar, toggleRTL } from '@/store/themeConfigSlice';
import Dropdown from '@/components/dropdown';
import IconMenu from '@/components/icon/icon-menu';
import IconSearch from '@/components/icon/icon-search';
import IconXCircle from '@/components/icon/icon-x-circle';
import { usePathname, useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import ThemeChanger from '../custom/ThemeChanger';
import UserProfile from '../custom/UserProfile';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const Header = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t, i18n } = getTranslation();

  const [search, setSearch] = useState(false);

  const isRtl = useAppSelector((state) => state.theme.rtlClass) === 'rtl';
  const themeConfig = useAppSelector((state) => state.theme);

  useEffect(() => {
    const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
    if (selector) {
      const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove('active');
      }

      let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
      for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i];
        element?.classList.remove('active');
      }
      selector?.classList.add('active');

      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
        if (ele) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add('active');
          });
        }
      }
    }
  }, [pathname]);

  const setLocale = (flag: string) => {
    if (flag.toLowerCase() === 'ae' || flag.toLowerCase() === 'ur') {
      dispatch(toggleRTL('rtl'));
    } else {
      dispatch(toggleRTL('ltr'));
    }
    router.refresh();
  };

  return (
    <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
      <div className="shadow-sm">
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/icon.png" alt="logo" />
              <span className="hidden align-middle text-sm font-semibold transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">
                Easy For Net
              </span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
              <form
                className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                onSubmit={() => setSearch(false)}
              >
                <div className="relative">
                  <input
                    type="text"
                    className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pl-9 rtl:pr-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4"
                    placeholder="Search..."
                  />
                  <button type="button" className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
                    <IconSearch className="mx-auto" />
                  </button>
                  <button type="button" className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 ltr:right-2 rtl:left-2 sm:hidden" onClick={() => setSearch(false)}>
                    <IconXCircle />
                  </button>
                </div>
              </form>
              <button
                type="button"
                onClick={() => setSearch(!search)}
                className="search_btn rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60 sm:hidden"
              >
                <IconSearch className="mx-auto h-4.5 w-4.5 dark:text-[#d0d2d6]" />
              </button>
            </div>

            <div>
              <ThemeChanger theme={themeConfig.theme} />
            </div>

            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={i18n.language && <img className="h-5 w-5 rounded-full object-cover" src={`/assets/images/flags/${i18n.language.toUpperCase()}.svg`} alt="flag" />}
              >
                <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  {themeConfig.languageList.map((item: any) => {
                    return (
                      <li key={item.code}>
                        <button
                          type="button"
                          className={`flex w-full hover:text-primary ${i18n.language === item.code ? 'bg-primary/10 text-primary' : ''}`}
                          onClick={() => {
                            i18n.changeLanguage(item.code);
                            setLocale(item.code);
                          }}
                        >
                          <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="h-5 w-5 rounded-full object-cover" />
                          <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Dropdown>
            </div>

            <div className="dropdown flex shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative group block"
                button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" />}
              >
                <UserProfile />
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
