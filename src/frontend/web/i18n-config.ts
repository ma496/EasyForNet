export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ur', 'zh', 'ar', 'hi', 'es', 'fr', 'ru'],
} as const

export type Locale = (typeof i18n)['locales'][number]
