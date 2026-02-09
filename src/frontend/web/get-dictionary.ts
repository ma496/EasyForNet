import 'server-only'
import type { Locale } from './i18n-config'

const dictionaries = {
  en: () => import('./public/locales/en.json').then((module) => module.default),
  ur: () => import('./public/locales/ur.json').then((module) => module.default),
  zh: () => import('./public/locales/zh.json').then((module) => module.default),
  ar: () => import('./public/locales/ar.json').then((module) => module.default),
  hi: () => import('./public/locales/hi.json').then((module) => module.default),
  es: () => import('./public/locales/es.json').then((module) => module.default),
  fr: () => import('./public/locales/fr.json').then((module) => module.default),
  ru: () => import('./public/locales/ru.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.en()
