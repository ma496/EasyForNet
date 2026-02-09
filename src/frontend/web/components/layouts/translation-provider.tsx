'use client'

import { createContext, useContext, useEffect } from 'react'

const TranslationContext = createContext<Record<string, string>>({})

export let globalDictionary: Record<string, string> = {}

export const TranslationProvider = ({
  dictionary,
  children,
}: {
  dictionary: Record<string, string>
  children: React.ReactNode
}) => {
  // globalDictionary = dictionary
  // globalDictionary = dictionary
  // Side effect moved to useEffect
  useEffect(() => {
    globalDictionary = dictionary
  }, [dictionary])
  return <TranslationContext.Provider value={dictionary}>{children}</TranslationContext.Provider>
}

import { useRouter, usePathname } from 'next/navigation'
import { i18n as i18nConfig } from '@/i18n-config'

export const useTranslation = () => {
  const dictionary = useContext(TranslationContext)
  const router = useRouter()
  const pathname = usePathname()

  const t = (key: string, variables?: Record<string, string | number>) => {
    let text = dictionary[key] || key
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`\${${k}}`, String(v))
      })
    }
    return text
  }

  const changeLanguage = (locale: string) => {
    const segments = pathname.split('/')
    // handle case where pathname starts with a locale
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (segments.length > 1 && i18nConfig.locales.includes(segments[1] as any)) {
      segments[1] = locale
    } else {
      segments.splice(1, 0, locale)
    }

    // If setting to default locale, remove the locale segment
    if (locale === i18nConfig.defaultLocale) {
      // Find if we have a locale segment and remove it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (segments.length > 1 && i18nConfig.locales.includes(segments[1] as any)) {
        segments.splice(1, 1);
      }
    }

    const newPath = segments.join('/') || '/'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(newPath as any)
  }

  const currentLang = pathname.split('/')[1]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const language = i18nConfig.locales.includes(currentLang as any) ? currentLang : i18nConfig.defaultLocale

  const i18n = {
    language,
    changeLanguage
  }

  return { t, i18n }
}
