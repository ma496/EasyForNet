'use client'

import { useTranslation as useTranslationProvider, globalDictionary } from '@/components/layouts/translation-provider'
import { i18n as i18nConfig } from './i18n-config'

// Re-export the hook for components to use
export const useTranslation = useTranslationProvider

/**
 * Legacy support for non-component files.
 * WARNING: This functions relies on the TranslationProvider being mounted to populate globalDictionary.
 * It does NOT support reactive updates for language changes (requires full page reload or manual re-call).
 */
export const getTranslation = () => {
  const dictionary = globalDictionary

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
    const pathname = window.location.pathname
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
    window.location.href = newPath
  }

  const i18n = {
    language: 'en', // Best effort guess or need to parse URL manually if needed
    changeLanguage,
  }

  const initLocale = (_themeLocale: string) => {
    // No-op
  }

  return { t, i18n, initLocale }
}

// Async version compatibility (just wraps sync)
export const getTranslationAsync = async () => {
  return getTranslation()
}
