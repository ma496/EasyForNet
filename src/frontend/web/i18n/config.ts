export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'ur', 'zh', 'ar', 'hi', 'es', 'fr', 'ru'],
} as const

export type Locale = (typeof i18nConfig)['locales'][number]
