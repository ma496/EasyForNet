'use client'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleRTL, toggleTheme, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from '@/store/slices/themeConfigSlice'
import AppLoading from '@/components/layouts/app-loading'
import { i18n } from '@/i18n-config'
import { getTranslation } from '@/i18n'
import { setUserInfo } from './store/slices/authSlice'
import { useLazyGetUserInfoQuery } from './store/api/identity/account/account-api'
import { isAllowed } from './lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { getMatchedAuthUrl } from './auth-urls'

function App({ children }: PropsWithChildren) {
  const themeConfig = useAppSelector((state) => state.theme)
  const dispatch = useAppDispatch()
  const { initLocale } = getTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const authState = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [getUserInfo, { isLoading: isLoadingUserInfo }] = useLazyGetUserInfoQuery()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const result = await getUserInfo()
      if (result.data) {
        dispatch(setUserInfo(result.data))
      }
    }
    fetchUserInfo()
  }, [getUserInfo, dispatch])

  useEffect(() => {
    if (isLoadingUserInfo) return

    if (!authState.isAuthenticated || !authState.user) return

    const matchedUrl = getMatchedAuthUrl(pathname)
    if (matchedUrl?.permissions && matchedUrl.permissions.length > 0 && !isAllowed(authState, matchedUrl.permissions)) {
      router.push('/unauthorized')
    }
  }, [pathname, authState, isLoadingUserInfo, router])

  useEffect(() => {
    dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme))
    dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu))
    dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout))
    dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation))
    dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar))
    dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark))

    // Calculate direction based on URL language
    const pathSegment = pathname.split('/')[1]
    const lang = i18n.locales.includes(pathSegment as any) ? pathSegment : i18n.defaultLocale
    const currentLang = themeConfig.languageList.find(l => l.code === lang)
    const direction = currentLang ? (currentLang.isRTL ? 'rtl' : 'ltr') : 'ltr'

    dispatch(toggleRTL(direction))

    // locale
    initLocale(themeConfig.locale)

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false)
  }, [dispatch, initLocale, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark, pathname, themeConfig.languageList])

  return (
    <div
      className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${themeConfig.rtlClass
        } main-section relative font-nunito text-sm font-normal antialiased`}
    >
      {isLoading || isLoadingUserInfo ? <AppLoading /> : children}
    </div>
  )
}

export default App
