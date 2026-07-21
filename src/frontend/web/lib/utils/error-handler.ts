import { i18nConfig, Locale } from "@/i18n"

interface ApiErrorPayload {
  status: number | string
}

/**
 * Extracts the current locale prefix from the URL pathname.
 * Returns the locale segment (e.g. 'en', 'ur') or an empty string for the default locale.
 */
const getLocalePrefix = (): string => {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const supportedLocales = i18nConfig.locales
  const currentLocale: Locale = segments[0] as Locale
  if (segments.length > 0 && supportedLocales.includes(currentLocale)) {
    return `/${segments[0]}`
  }
  return ''
}

/**
 * Centralized handler for managing RTK Query errors and displaying appropriate user feedback.
 */
export const rtkErrorHandler = (payload: ApiErrorPayload) => {
  if (payload?.status === 'FETCH_ERROR') {
    window.location.replace(`${getLocalePrefix()}/service-unavailable`)
  }
}
