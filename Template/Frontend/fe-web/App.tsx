'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleRTL, toggleTheme, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from '@/store/slices/themeConfigSlice';
import AppLoading from '@/components/layouts/app-loading';
import { getTranslation } from '@/i18n';
import { setUserInfo } from './store/slices/authSlice';
import { useLazyGetUserInfoQuery } from './store/api/account/account-api';
import { usePathname, useRouter } from 'next/navigation';
import { localeStorageConst } from './lib/constants';

function App({ children }: PropsWithChildren) {
  const themeConfig = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const { initLocale } = getTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // get and set user info
  const [getUserInfo, { isLoading: isLoadingUserInfo }] = useLazyGetUserInfoQuery()
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!localStorage.getItem(localeStorageConst.login)) {
        router.push('/signin')
      } else if (pathname !== '/signin' && pathname !== '/reset-password' && pathname !== '/forget-password') {
        const result = await getUserInfo()
        if (result.data) {
          dispatch(setUserInfo(result.data))
        } else {
          router.push('/signin')
        }
      }
    }
    fetchUserInfo()
  }, [])

  useEffect(() => {
    dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
    dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
    dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
    dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
    dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
    dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
    dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
    // locale
    initLocale(themeConfig.locale);

    setIsLoading(false);
  }, [dispatch, initLocale, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

  return (
    <div
      className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${themeConfig.rtlClass
        } main-section relative font-nunito text-sm font-normal antialiased`}
    >
      {isLoading || isLoadingUserInfo ? <AppLoading /> : children}
    </div>
  );
}

export default App;
